---
title: 通过 Speedrun API 获取排行榜数据
shortTitle: Speedrun API 简介
icon: trophy
order: 6
date: 2025-11-21
category: 丝之歌
tags:
  - 丝之歌
  - 速通
  - Python
copy: false
---

speedrun.com 官方提供了 [Speedrun API](https://github.com/speedruncomorg/api)，可以供我们通过 API 接口拉取 JSON 格式的数据。

它提供的功能非常强大，这里我们以《空洞骑士：丝之歌》为例进行一些简单介绍。

<!-- more -->

值得一提的是，对同一个IP，它有每分钟 100 次的访问限制。

直接访问 [https://www.speedrun.com/api/v1/games/silksong](https://www.speedrun.com/api/v1/games/silksong)，会返回一段 JSON 数据，它代表了丝之歌游戏的基本信息。最下面有这样一段内容：

```json :no-line-numbers :collapsed-lines=21 {15-18}
{
  "links": [
    {
      "rel": "self",
      "uri": "https://www.speedrun.com/api/v1/games/y65r7g81"
    },
    {
      "rel": "runs",
      "uri": "https://www.speedrun.com/api/v1/runs?game=y65r7g81"
    },
    {
      "rel": "levels",
      "uri": "https://www.speedrun.com/api/v1/games/y65r7g81/levels"
    },
    {
      "rel": "categories",
      "uri": "https://www.speedrun.com/api/v1/games/y65r7g81/categories"
    },
    {
      "rel": "variables",
      "uri": "https://www.speedrun.com/api/v1/games/y65r7g81/variables"
    },
    {
      "rel": "records",
      "uri": "https://www.speedrun.com/api/v1/games/y65r7g81/records"
    },
    {
      "rel": "series",
      "uri": "https://www.speedrun.com/api/v1/series/wnp1vlzn"
    },
    {
      "rel": "derived-games",
      "uri": "https://www.speedrun.com/api/v1/games/y65r7g81/derived-games"
    },
    {
      "rel": "romhacks",
      "uri": "https://www.speedrun.com/api/v1/games/y65r7g81/derived-games"
    },
    {
      "rel": "leaderboard",
      "uri": "https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/zd39j4nd"
    }
  ]
}
```

我们主要看这个`categories`，访问 [https://www.speedrun.com/api/v1/games/y65r7g81/categories](https://www.speedrun.com/api/v1/games/y65r7g81/categories)，会得到这样一段 JSON 数据：

```jsonc :no-line-numbers
{
  "data": [
    {
      "id": "zd39j4nd",
      "name": "Any%",
      "links": [
        {
          "rel": "variables",
          "uri": "https://www.speedrun.com/api/v1/categories/zd39j4nd/variables"
        },
        {
          "rel": "leaderboard",
          "uri": "https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/zd39j4nd"
        }
      ]
    },
//  {
//    ...
//  }
  ]
}
```

`data`下面是一个数组，每个元素是一个类别，就以这个`Any%`为例，`leaderboard`这个链接就是所有`Any%`类别的排行榜。但是打开之后发现有很多内容，这是因为没有筛选，所以无论是 All Glitches 还是 NMG 都会显示在里面。那么如何筛选呢？就需要用到这个 `variables` 了，打开它后面的这个链接 [https://www.speedrun.com/api/v1/categories/zd39j4nd/variables](https://www.speedrun.com/api/v1/categories/zd39j4nd/variables) ，会得到这样一段 JSON 数据：

```json :no-line-numbers :no-collapsed-lines
{
  "data": [
    {
      "id": "ylq4yvzn",
      "name": "Any% Subcategory",
      "values": {
        "_note": "`choices` is deprecated, please use `values` instead",
        "choices": {
          "qzne828q": "No Major Glitches",
          "lr34vkml": "All Glitches"
        },
        "values": {
          "qzne828q": {
            "label": "No Major Glitches",
            "rules": "# No Major Glitches rules\n\nIf a glitch is not listed here, assume it is banned until it is listed. You can check with a mod in the Discord or create a forum post.\n\nAny accidentally performed major glitch that does not save time may be allowed by verifier's discretion.\n\n## Allowed Glitches\n\n- [Pogo Endlag Cancels](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#pogo-endlag-cancel)\n- [Beast Boosts](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#beast-boost)\n- [Bind Dash Refresh](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#bind-dash-refresh)\n- [Tool Pogos (Drill/Snare w/ Voltvessels & others)](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#voltvessel-drill-pogos)\n  - Including Pin Pogos (_excluding_ pogoing infinitely spinning pins)\n- Lever Skips (including hitting chests through walls)\n- Queued Walljump Interrupts, including when Queued Walljump Interrupt Storage is incidentally gained.\n\n## Banned Glitches\n\n- Queued Walljump Interrupt Storage, when either:\n  - The storage is prolonged through other movement, such as sprint or clawline.\n  - The stored interrupt activates on NonSlider geometry.\n- Deep Docks Bridge Hazard Respawn\n- [Voltvessel One-way Wallbreak @ Bilewater-\u003EDucts shortcut](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#voltvessel-wall-breaks)\n- [Fourth Chorus Skip Skip](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#fourth-chorus-skip-skip)\n- [Trobbio Skips](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#trobbio-skip---rune-rage)\n- [Triple Jump](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#triple-jump)\n  - If accidental, a 2s penalty may be applied instead of rejection.\n- Scuttlebrace Jump Reset\n- [Float Sprint](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#float-sprint)\n- [Silkspear Storage](https://github.com/hk-speedrunning/Silksong-Rules/blob/main/glossary.md#silkspear-storage-trobbio-skip)\n- Any glitch that results in going Out of Bounds.\n- Main Menu Storage\n- Room Dupes\n- Any glitch that results in invincibility\n- Any glitch that results in enemy AI becoming unresponsive\n- Any glitch that results in invisibility where the player would otherwise be visible.\n  - Any glitch that gives the player control while invisible while they would not otherwise have control.",
            "flags": {
              "miscellaneous": false
            }
          },
          "lr34vkml": {
            "label": "All Glitches",
            "rules": "",
            "flags": {
              "miscellaneous": false
            }
          }
        },
        "default": "qzne828q"
      }
    },
    {
      "id": "rn1kmmvl",
      "name": "Any% Drifters Cloak?",
      "values": {
        "_note": "`choices` is deprecated, please use `values` instead",
        "choices": {
          "10vzvmol": "Cloakless",
          "qj70747q": "Cloak"
        },
        "values": {
          "10vzvmol": {
            "label": "Cloakless",
            "rules": "",
            "flags": {
              "miscellaneous": false
            }
          },
          "qj70747q": {
            "label": "Cloak",
            "rules": "",
            "flags": {
              "miscellaneous": false
            }
          }
        },
        "default": "10vzvmol"
      }
    }
  ]
}
```

没用的部分我们省略掉了，可以看到这里有两段：`Any% Subcategory`和`Any% Drifters Cloak?`，它们分别代表了两个变量，前者是 All Glitches 和 NMG 的区别，后者是是否有披风的路线的区别。我们在访问排行榜的时候就可以通过这两个变量来筛选出我们想要的排行榜了。

例如我们打算筛选出 NMG + Cloakless 的排行榜，也就是说，变量`ylq4yvzn`的值为`qzne828q`，变量`rn1kmmvl`的值为`10vzvmol`，我们就可以在地址后面加上参数`?var-ylq4yvzn=qzne828q&var-rn1kmmvl=10vzvmol`。

结果我们发现，排行榜中只有每个玩家的ID，那么还需要调用一下用户信息的查询接口才能获取玩家的名字，这很麻烦。好在 API 还给我们提供了一个参数，在地址最后面加上`&embed=players`，那么在返回的 JSON 数据中就会多出来一个字段，顺带帮你查找了这些榜上用户的用户信息。

再者，我们可能只想显示前五名，那就继续加上 `&top=5`。

完整的地址如下：\
[https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/zd39j4nd?var-ylq4yvzn=qzne828q&var-rn1kmmvl=10vzvmol&embed=players&top=5](https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/zd39j4nd?var-ylq4yvzn=qzne828q&var-rn1kmmvl=10vzvmol&embed=players&top=5)

得到的数据自行解析即可，这里就不花篇幅讲解了。下面给一个代码示例，仅供参考。（示例中的有些分类后续可能被速通社区修改，因此这些地址不一定永远正确，使用时请注意）

```python
import requests
import sys

from datetime import datetime, date

URL = {"anylp":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/zd39j4nd?var-ylq4yvzn=qzne828q&var-rn1kmmvl=qj70747q",
       "anyrp": "https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/zd39j4nd?var-ylq4yvzn=qzne828q&var-rn1kmmvl=10vzvmol",
       "te":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/n2y0m18d?var-dloed1dn=qyzod221",
       "100noab":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/rkl6zprk?var-rn1k7xol=lx5o7641&var-38dg4448=1w4p4dmq",
       "100ab":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/rkl6zprk?var-rn1k7xol=lx5o7641&var-38dg4448=qoxpx35q",
       "judgement":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/wk6544o2?var-jlz631q8=1w4ozxvq",
       "low":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/wkp4r60k?var-9l7geqpl=1397dnx1",
       "ab":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/w206ox52?var-kn0eyxz8=10vzo8wl",
       "twisted":"https://www.speedrun.com/api/v1/leaderboards/y65r7g81/category/9kvvl0ok?var-yn26pzel=le2z97kl",
       "苔穴":"https://www.speedrun.com/api/v1/leaderboards/yd4r2x51/level/9m58yezd/xd1ypjwd?var-r8r69958=qvvpvrrq"}

CATEGORY_NAMES = {
    "anylp": "Any% 斗篷",
    "anyrp": "Any% 无斗篷",
    "te": "True Ending",
    "100noab": "100% No AB",
    "100ab": "100% All Bosses",
    "judgement": "Judgement",
    "low": "Low%",
    "ab": "All Bosses",
    "twisted": "Twisted%",
    "苔穴": "苔穴",
}

def get_player_name(player, players):
    for p in players:
        if p["id"] == player["id"]:
            return p["names"]["international"]
    return player.get("name", "Unknown")

def format_time(t):
    m = int(t // 60)
    s = t - m * 60
    h = int(m // 60)
    if h > 0:
        m = m - h * 60
        return f"{h:d}:{m:02d}:{int(s):02d}"
    if m < 10:
        return f"{m:d}:{s:06.3f}"
    return f"{m:02d}:{int(s):02d}"

def format_relative_date(date_str):
    """
    将日期字符串转换为相对时间描述

    参数:
        date_str: 日期字符串，格式为 'YYYY-MM-DD'

    返回:
        str: 相对时间描述，如"今天"、"昨天"、"前天"、"X天前"、"X个月前"
    """
    try:
        input_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        today = date.today()
        delta = today - input_date
        days_diff = delta.days

        if days_diff == 0:
            return "今天"
        elif days_diff == 1:
            return "昨天"
        elif days_diff == 2:
            return "前天"
        elif 3 <= days_diff < 30:
            return f"{days_diff}天前"
        elif 30 <= days_diff < 60:
            return "上个月"
        elif days_diff >= 60:
            months = days_diff // 30
            return f"{months}个月前"
        else:
            # 如果是未来日期，返回原日期
            return date_str
    except ValueError:
        # 如果日期格式错误，返回原字符串
        return date_str

def main(user_input):
    resp = requests.get(URL[user_input] + "&embed=players&top=5", timeout=60)
    resp.raise_for_status()

    data = resp.json()["data"]
    runs = data["runs"]
    if len(runs) > 5:
        runs = runs[:5]

    players = data.get("players", {}).get("data", [])

    print(f"=== 丝之歌 — {CATEGORY_NAMES[user_input]} — NMG ===")
    for entry in runs:
        place = entry["place"]
        run = entry["run"]
        time_sec = run["times"]["primary_t"]

        player = get_player_name(run["players"][0], players)
        time_str = format_time(time_sec)
        relative_date = " — " + format_relative_date(run["date"]) if "date" in run else ""

        print(f"{place}. {player} — {time_str}{relative_date}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1]
    else:
        arg = input("输入您想查询的榜单(any,te,100,judgement,low,ab,twisted,苔穴): ")
    arg = arg.replace("%", "").lower()
    if arg == "any":
        main("anyrp")
        main("anylp")
    elif arg in ("all bosses", "all boss", "allbosses", "allboss"):
        main("ab")
    elif arg == "100":
        main("100noab")
        main("100ab")
    else:
        main(arg)
```
