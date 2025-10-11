<template>
  <div>
    <button @click="play" :disabled="!isRendered || isPlaying" class="play-btn">
      {{ isPlaying ? '播放中...' : '播放' }}
    </button>
  </div>
  <div class="abc-container" ref="scoreContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  notation: {
    type: String,
    required: true
  },
  measuresPerLine: {
    type: Number,
    default: 4
  },
  scale: {
    type: Number,
    default: 1.0
  }
});

const scoreContainer = ref(null);
const isRendered = ref(false);
const isPlaying = ref(false);

// 检查 abcjs 是否已加载
const checkAbcjsLoaded = () => {
  if (typeof window === 'undefined') return false;
  
  // 检查多种可能的全局变量名
  const possibleNames = ['abcjs', 'ABCJS', 'abc'];
  for (const name of possibleNames) {
    if (window[name] && typeof window[name].renderAbc === 'function') {
      return true;
    }
  }
  
  return false;
};


// 获取abcjs库对象
const getAbcjsLib = () => {
  const possibleNames = ['abcjs', 'ABCJS', 'abc'];
  for (const name of possibleNames) {
    if (window[name] && typeof window[name].renderAbc === 'function') {
      return window[name];
    }
  }
  return null;
};

// 等待 abcjs 加载
const waitForAbcjs = () => {
  return new Promise((resolve, reject) => {
    if (checkAbcjsLoaded()) {
      resolve();
      return;
    }

    // 轮询等待
    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject(new Error('ABCJS 加载超时'));
    }, 10000);

    const interval = setInterval(() => {
      if (checkAbcjsLoaded()) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

const renderScore = async () => {
  if (!scoreContainer.value || isRendered.value) return;

  try {
    // 等待 abcjs 加载完成
    await waitForAbcjs();

    const processedNotation = props.notation.replace(/\\n/g, '\n');

    // 清空容器内容
    scoreContainer.value.innerHTML = '';

    // 获取abcjs库对象
    const abcjsLib = getAbcjsLib();
    if (!abcjsLib) {
      throw new Error('无法获取abcjs库对象');
    }

    // 使用abcjs库对象
    abcjsLib.renderAbc(scoreContainer.value, processedNotation, {
      responsive: 'resize',
      scale: props.scale,
      wrap: {
        minSpacing: 2.5,
        maxSpacing: 4,
        preferredMeasuresPerLine: props.measuresPerLine
      }
    });

    isRendered.value = true;
  } catch (error) {
    console.error('ABCJS 渲染失败:', error);
    if (scoreContainer.value) {
      scoreContainer.value.innerHTML = `<p style="color: red;">乐谱渲染失败: ${error.message}</p>`;
    }
  }
};


const play = async () => {
  if (!isRendered.value || isPlaying.value) return;

  try {
    isPlaying.value = true;

    // 创建音频上下文（必须在用户交互内）
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 获取abcjs库对象
    const abcjsLib = getAbcjsLib();
    if (!abcjsLib) {
      throw new Error('无法获取abcjs库对象');
    }

    // 渲染乐谱对象
    const visualObj = abcjsLib.renderAbc(scoreContainer.value, props.notation)[0];

    const synth = new abcjsLib.synth.CreateSynth();
    await synth.init({
      audioContext: audioContext,
      visualObj: visualObj
    });
    await synth.prime();
    await synth.start();
    setTimeout(() => {
      isPlaying.value = false;
    }, 1000)
  } catch (error) {
    console.error('播放失败:', error);
    isPlaying.value = false;
  }
};

onMounted(() => {
  setTimeout(() => {
    nextTick(() => {
      renderScore();
    });
  }, 200);
});

// 监听属性变化，重新渲染
watch(() => props.notation, () => {
  isRendered.value = false;
  nextTick(() => {
    renderScore();
  });
});

watch(() => props.measuresPerLine, () => {
  isRendered.value = false;
  nextTick(() => {
    renderScore();
  });
});
</script>

<style scoped>
.abc-container {
  overflow-x: auto;
  min-height: 120px;
}

.play-btn {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.play-btn:hover:not(:disabled) {
  background: #359c6d;
}

.play-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>