<template>
  <el-select
      v-model="currentTemplate"
      filterable
      placeholder="你可以选择现有模板"
      style="width: 500px"
      @change="selectTemplate"
  >
    <el-option
        v-for="item in templateOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>

  <!-- 纯客户端文件上传 -->
  <div
      class="upload-zone"
      @click="triggerUpload"
      @dragover.prevent
      @drop.prevent="e => { const f = e.dataTransfer.files[0]; if (f) { const reader = new FileReader(); reader.onload = ev => { try { parseLssFile(ev.target.result) } catch(err) { ElMessage({ message: `解析文件失败: ${err.message}`, type: 'error', plain: true }) } }; reader.readAsText(f, 'utf-8') } }"
  >
    <el-icon size="40" style="color: var(--el-text-color-secondary)"><UploadFilled /></el-icon>
    <div style="margin-top: 8px; color: var(--el-text-color-secondary);">
      你也可以将文件拖拽到这里或者 <em>点击上传</em>
    </div>
    <div style="font-size: 12px; color: var(--el-text-color-placeholder); margin-top: 4px;">
      只支持 *.lss 文件
    </div>
  </div>
  <input
      ref="fileInputRef"
      type="file"
      accept=".lss"
      style="display: none"
      @change="onFileChange"
  />

  <div style="display: flex; gap: 8px;">
    <el-button type="success" @click="fillIcons">一键填充所有未填充的图标</el-button>
    <el-button type="danger" @click="resetIcons">一键清空所有图标</el-button>
  </div>

  <div style="display: flex; align-items: center; gap: 12px;">
    <el-switch
        v-model="skipStartAnimation"
        size="large"
        active-text="跳过开场动画"
        inactive-text="不跳过"
        @change="onSkipStartAnimationChange"
        :disabled="disableStartAnimation"
    />
    <router-link to="speedrun-submit.html#新规则-允许跳过开场动画">
      <el-text size="large" style="text-decoration: underline;">这是什么意思？</el-text>
    </router-link>
  </div>

  <el-table :data="tableData" style="width: 100%;">
    <el-table-column label="图标" width="60px">
      <template #default="scope">
        <el-image
            v-if="scope.row.icon"
            style="width: 25px; height: 25px"
            :src="scope.row.icon"
            fit="contain"
        />
      </template>
    </el-table-column>

    <el-table-column label="节点名称" :width="310">
      <template #default="scope">
        <el-input
            v-if="scope.$index > 0 && scope.$index < tableData.length - 1"
            v-model="scope.row.name"
            placeholder="节点名称"
        />
      </template>
    </el-table-column>

    <el-table-column label="触发事件" :width="310">
      <template #default="scope">
        <el-select
            v-if="scope.$index < tableData.length - 1"
            v-model="scope.row.event"
            filterable
            placeholder="触发事件"
            @change="onEventChange(scope.$index)"
        >
          <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id"
          />
        </el-select>
      </template>
    </el-table-column>

    <el-table-column label="操作" :width="200">
      <template #default="scope">
        <el-button
            v-if="scope.$index > 0"
            :icon="Plus"
            circle
            @click="addLine(scope.$index)"
        />
        <el-button
            v-if="scope.$index > 0 && scope.$index < tableData.length - 1"
            :disabled="tableData.length <= 3"
            :icon="Minus"
            circle
            @click="removeLine(scope.$index)"
        />
        <el-button
            v-if="scope.$index > 0 && scope.$index < tableData.length - 1"
            :disabled="scope.$index <= 1"
            :icon="Top"
            circle
            @click="swapLine(scope.$index - 1, scope.$index)"
        />
        <el-button
            v-if="scope.$index > 0 && scope.$index < tableData.length - 1"
            :disabled="scope.$index >= tableData.length - 2"
            :icon="Bottom"
            circle
            @click="swapLine(scope.$index, scope.$index + 1)"
        />
      </template>
    </el-table-column>
  </el-table>

  <el-checkbox v-model="includeTimeRecords" size="large">
    保留*.lss文件中原本的时间记录（如果有）
  </el-checkbox>

  <el-button
      type="primary"
      @click="submit"
      style="align-self: flex-start;"
      :disabled="disableSubmit"
  >
    另存为
  </el-button>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import {
  ElMessage, ElSelect, ElOption, ElIcon, ElImage,
  ElInput, ElButton, ElTable, ElTableColumn, ElCheckbox, ElSwitch, ElText,
} from 'element-plus';
import { Plus, Minus, Top, Bottom, UploadFilled } from '@element-plus/icons-vue';
import { saveAs } from 'file-saver';
import options from 'virtual:sss-options';
import iconMap from 'virtual:sss-icon-map';
import templates from 'virtual:sss-templates';

const getIconUrlById = function(splitId) {
  return iconMap[splitId] || ''
};

// ---- 状态 ----
const includeTimeRecords = ref(true);
const disableSubmit = ref(false);
const skipStartAnimation = ref(false);
const disableStartAnimation = ref(false);
const currentTemplate = ref('');

// tableData 每行: { name, event, icon（url string）, other（lss 原始 XML 片段，用于保留时间记录）}
const tableData = reactive([
  { name: '', event: 'StartNewGame', icon: getIconUrlById('StartNewGame'), other: null },
  { name: '任意结束', event: 'EndingSplit', icon: getIconUrlById('EndingSplit'), other: null },
  { name: '', event: 'ManualSplit', icon: '', other: null },
]);

// 存储从上传的 lss 文件解析出的完整 xmlRun 数据（用于保留时间记录）
const uploadedRun = ref(null);

// ---- 模板选项 ----
const templateOptions = computed(() =>
  templates.map(t => ({ value: t.filename, label: `${t.categoryName} (${t.filename})` }))
);

// ---- 开始动画逻辑 ----
const refreshStartAnimationChange = function(eventValue) {
  if (eventValue === 'StartNewGame') {
    skipStartAnimation.value = false;
    disableStartAnimation.value = false;
  } else if (eventValue === 'Act1Start') {
    skipStartAnimation.value = true;
    disableStartAnimation.value = false;
  } else {
    disableStartAnimation.value = true;
  }
};

const onSkipStartAnimationChange = function(val) {
  const newEvent = val ? 'Act1Start' : 'StartNewGame';
  if (tableData[0].event !== newEvent) {
    tableData[0].event = newEvent;
  }
};

// ---- 行操作 ----
const addLine = function(index) {
  tableData.splice(index, 0, {
    name: '手动分割',
    event: 'ManualSplit',
    icon: '',
    other: null,
  });
};

const removeLine = function(index) {
  tableData.splice(index, 1);
};

const swapLine = function(i, j) {
  const tmp = { ...tableData[i] };
  Object.assign(tableData[i], tableData[j]);
  Object.assign(tableData[j], tmp);
};

// ---- 事件变更 ----
const onEventChange = function(idx) {
  const eventValue = tableData[idx].event;
  if (idx === 0) refreshStartAnimationChange(eventValue);

  const opt = options.find(o => o.id === eventValue);
  if (opt) {
    const label = opt.label;
    const pos = label.lastIndexOf('（');
    tableData[idx].name = pos === -1 ? label : label.slice(0, pos);
  }

  if (idx !== 0) {
    tableData[idx].icon = getIconUrlById(eventValue);
  }
};

// ---- 图标批量操作 ----
const fillIcons = function() {
  for (let i = 1; i < tableData.length - 1; i++) {
    if (!tableData[i].icon) {
      tableData[i].icon = getIconUrlById(tableData[i].event);
    }
  }
};

const resetIcons = function() {
  for (let i = 1; i < tableData.length - 1; i++) {
    tableData[i].icon = '';
    tableData[i].rawIcon = '';
  }
};

// ---- 选择模板 ----
const selectTemplate = function(filename) {
  const tpl = templates.find(t => t.filename === filename);
  if (!tpl) return;
  uploadedRun.value = null;

  const newRows = tpl.splits.map((s, i) => ({
    name: s.name,
    event: s.event,
    icon: i === 0 ? '' : s.icon,
    other: null,
  }));
  newRows.push({ name: '', event: 'ManualSplit', icon: '', other: null });

  tableData.splice(0, tableData.length, ...newRows);
  refreshStartAnimationChange(tableData[0].event);
};

// ---- 上传 .lss 文件（纯客户端解析 XML）----
const fileInputRef = ref(null);

const triggerUpload = function() {
  fileInputRef.value?.click();
};

// LiveSplit 图标格式 -> data URL
// LiveSplit 前缀: AAEAAAD...（System.Drawing.Bitmap BinaryFormatter）
// 实际 PNG 数据从 base64 解码后找 PNG 魔数开始
const PNG_MAGIC = '\x89PNG\r\n\x1a\n';

const convertLiveSplitIconToDataUrl = function(b64) {
  if (!b64) return '';
  try {
    const bin = atob(b64);
    const idx = bin.indexOf(PNG_MAGIC);
    if (idx < 0) return '';
    const pngBin = bin.slice(idx);
    const bytes = new Uint8Array(pngBin.length);
    for (let i = 0; i < pngBin.length; i++) bytes[i] = pngBin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'image/png' });
    return URL.createObjectURL(blob);
  } catch {
    return '';
  }
};

const parseLssFile = function(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) throw new Error('XML 格式错误');

  // 读取 Segments
  const segments = [...doc.querySelectorAll('Run > Segments > Segment')];
  const rows = [{ name: '', event: '', icon: '', other: null }]; // 第 0 行占位（给 start trigger 用）

  for (const seg of segments) {
    const name = seg.querySelector('Name')?.textContent || '';
    const iconCdata = seg.querySelector('Icon')?.textContent || '';
    rows.push({
      name,
      event: '',
      icon: iconCdata ? convertLiveSplitIconToDataUrl(iconCdata) : '',
      rawIcon: iconCdata, // 保留原始 LiveSplit base64，供导出时使用
      other: seg, // 保留原始节点
    });
  }

  // 读取 AutoSplitterSettings splits list
  const settings = [...doc.querySelectorAll('AutoSplitterSettings > CustomSettings > Setting')];
  const splitsNode = settings.find(s => s.getAttribute('id') === 'splits');
  if (splitsNode) {
    const items = [...splitsNode.querySelectorAll('Setting')];
    for (let i = 0; i < items.length; i++) {
      const val = items[i].getAttribute('value') || '';
      if (i < rows.length) {
        rows[i].event = val;
      } else {
        rows.push({ name: '', event: val, icon: '', other: null });
      }
    }
  }

  // 末尾补 ManualSplit
  rows.push({ name: '', event: 'ManualSplit', icon: '', other: null });

  uploadedRun.value = doc;
  tableData.splice(0, tableData.length, ...rows);
  refreshStartAnimationChange(tableData[0]?.event || '');
};

const onFileChange = function(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      parseLssFile(ev.target.result);
    } catch (err) {
      ElMessage({ message: `解析文件失败: ${err.message}`, type: 'error', plain: true });
    }
    // 重置 input，允许重复上传同一文件
    e.target.value = '';
  }
  reader.readAsText(file, 'utf-8');
};

// data URL -> LiveSplit base64
const LIVESPLIT_HEADER = 'AAEAAAD/////AQAAAAAAAAAMAgAAAFFTeXN0ZW0uRHJhd2luZywgVmVyc2lvbj00LjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPWIwM2Y1ZjdmMTFkNTBhM2EFAQAAABVTeXN0ZW0uRHJhd2luZy5CaXRtYXABAAAABERhdGEHAgIAAAAJAwAAAA8DAAAAOw8A';

const convertDataUrlToLiveSplit = function(dataUrl) {
  if (!dataUrl) return '';
  // 如果是 object URL 或非 data:image/png;base64, 格式，无法转换
  if (!dataUrl.startsWith('data:image/png;base64,')) return '';
  const b64 = dataUrl.slice('data:image/png;base64,'.length);
  // 添加 LiveSplit 前缀：\x00\x02 + PNG bytes
  const pngBin = atob(b64);
  const buf = new Uint8Array(2 + pngBin.length);
  buf[0] = 0x00;
  buf[1] = 0x02;
  for (let i = 0; i < pngBin.length; i++) buf[i + 2] = pngBin.charCodeAt(i);
  // 转 base64
  let str = '';
  for (const b of buf) str += String.fromCharCode(b);
  return LIVESPLIT_HEADER + btoa(str);
}

// ---- 导出 .lss ----
const escapeXml = function(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const buildXml = async function() {
  // 取已有的 xmlRun 元数据（若有上传的文件）
  let version = '1.7.0';
  let gameName = 'Hollow Knight: Silksong';
  let categoryName = '';
  let attemptCount = 0;
  let autoSplitterVersion = '1.0';

  if (uploadedRun.value) {
    const doc = uploadedRun.value;
    version = doc.querySelector('Run')?.getAttribute('version') || version;
    gameName = doc.querySelector('Run > GameName')?.textContent || gameName;
    categoryName = doc.querySelector('Run > CategoryName')?.textContent || categoryName;
    attemptCount = parseInt(doc.querySelector('Run > AttemptCount')?.textContent || '0') || 0;
    autoSplitterVersion = doc.querySelector('AutoSplitterSettings')?.getAttribute('Version') || autoSplitterVersion;
  }

  // 计算 offset
  const startEvent = tableData[0]?.event || 'StartNewGame';
  const offset = startEvent === 'Act1Start' ? '00:00:21.7600000' : '00:00:00';

  const lines = tableData.slice(0, -1); // 去掉最后一行虚拟 ManualSplit

  // 把静态 URL 转成 data:image/png;base64, 以便后续转 LiveSplit base64
  const fetchPngAsDataUrl = async function(url) {
    try {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let bin = '';
      for (const b of bytes) bin += String.fromCharCode(b);
      return 'data:image/png;base64,' + btoa(bin);
    } catch {
      return '';
    }
  };

  // 构建 Segments
  const segmentRows = await Promise.all(lines.slice(1).map(async row => {
    let iconVal = row.rawIcon || '';
    if (!iconVal) {
      const dataUrl = row.icon?.startsWith('data:') ? row.icon
        : row.icon ? await fetchPngAsDataUrl(row.icon)
        : '';
      iconVal = convertDataUrlToLiveSplit(dataUrl);
    }

    let otherSegmentXml = '';
    if (includeTimeRecords.value && row.other instanceof Element) {
      const ser = new XMLSerializer();
      for (const child of row.other.childNodes) {
        const tag = child.nodeName?.toLowerCase();
        if (tag === 'name' || tag === 'icon') continue;
        otherSegmentXml += ser.serializeToString(child);
      }
    }

    return `  <Segment>
    <Name>${escapeXml(row.name)}</Name>
    <Icon><![CDATA[${iconVal}]]></Icon>${otherSegmentXml}
  </Segment>`;
  }));
  const segmentsXml = segmentRows.join('\n');

  // 构建 splits setting list
  const splitSettings = lines.map(row =>
    `      <Setting type="string" value="${escapeXml(row.event)}"/>`
  ).join('\n');

  // 收集 Run 级别的额外节点（时间记录等）
  let runOtherXml = '';
  if (includeTimeRecords.value && uploadedRun.value) {
    const doc = uploadedRun.value;
    const ser = new XMLSerializer();
    const knownTags = new Set(['gameicon', 'gamename', 'categoryname', 'offset', 'attemptcount', 'segments', 'autosplittersettings']);
    for (const child of doc.querySelector('Run').childNodes) {
      const tag = child.nodeName?.toLowerCase();
      if (!tag || tag === '#text' || knownTags.has(tag)) continue;
      runOtherXml += ser.serializeToString(child) + '\n';
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<Run version="${escapeXml(version)}">
  <GameIcon/>
  <GameName>${escapeXml(gameName)}</GameName>
  <CategoryName>${escapeXml(categoryName)}</CategoryName>
  <Offset>${offset}</Offset>
  <AttemptCount>${attemptCount}</AttemptCount>
  <Segments>
${segmentsXml}
  </Segments>
  <AutoSplitterSettings Version="${autoSplitterVersion}">
    <CustomSettings>
      <Setting id="script_name" type="string" value="silksong_autosplit_wasm"/>
      <Setting id="splits" type="list">
${splitSettings}
      </Setting>
    </CustomSettings>
  </AutoSplitterSettings>
${runOtherXml}</Run>`;
};

const submit = async function() {
  disableSubmit.value = true;
  try {
    const xml = await buildXml();
    const blob = new Blob([xml], { type: 'application/octet-stream' });
    saveAs(blob, 'splits.lss');
  } catch (err) {
    console.error(err);
    ElMessage({ message: '导出失败', type: 'error', plain: true });
  } finally {
    setTimeout(() => { disableSubmit.value = false }, 1000);
  }
};
</script>

<style scoped>
.upload-zone {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.upload-zone:hover {
  border-color: var(--el-color-primary);
}

:deep(.el-table__header-wrapper .el-table__header) {
  margin: 0;
}

:deep(.el-table__body-wrapper .el-table__body) {
  margin: 0;
}

:deep(th) {
  border: none;
}

:deep(td) {
  border: none;
}
</style>
