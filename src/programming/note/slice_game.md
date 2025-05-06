---
title: 用AStar算法解决滑块问题
order: 9
category: 编程随笔
icon: chess-board
tags:
  - 算法
  - Erlang
date: 2023-10-11
---

有这样一个问题：

给定一个3×3的网格，每个格子上有1-8共8个数字，最后一个格子是空的。每次只能将紧挨着空格子的一个格子移到空格子上，将其随机打乱，例如得到这样一个状态：

| 3 |   | 4 |
|:-:|:-:|:-:|
| 5 | 2 | 8 |
| 1 | 6 | 7 |

现在请问，如何用尽可能少的步数将其恢复到初始状态？

首先，我们可以用**广度优先遍历**的方法来解决这个问题。我们从初始状态开始，只有可能空格相邻的格子移动到空格上，于是我们可以用一个队列来存储这些移动方法。接下来，我们从队列中取出一个移动方法，从这个新的状态开始继续考虑，同样只有可能空格相邻的格子移动到空格上，我们继续将这些可能的操作加入到队列中去，重复这个过程，直到我们找到一个状态是初始状态1-8排好为止。当然了，在这之中，我们需要记下已经遍历过的状态，以免重复遍历。前面所说的队列就是广度优先遍历的**开集**，后面记录已经遍历过的状态就是**闭集**。

既然我们可以用**广度优先遍历**，那自然就可以用**AStar**算法来解决问题。按照AStar算法的思路我们只需要把队列按照“评估函数”来排个序。那么“评估函数”是什么呢？

$$
f(n) = g(n) + h(n)
$$

其中，$g(n)$表示从最开始的状态到现在已走过的步数，$h(n)$表示从当前状态到最终目标状态的预估步数。前者很简单，那么预估步数怎么得到呢？我们可以用**曼哈顿距离**来计算。

在一个网格中，两个点之间的**曼哈顿距离**等于它们在横向和纵向上的距离之和。我们就以这个状态举例：

| 3 |   | 4 |
|:-:|:-:|:-:|
| 5 | 2 | 8 |
| 1 | 6 | 7 |

现在的数字5所在的位置其实应该是数字4的目标位置，那么数字4从现在的位置到目标位置的曼哈顿距离就是$2+1=3$。我们把每个数字的当前位置和目标位置的曼哈顿距离加起来，就可以作为预估步数$h(n)$的值了。

这样一来，我们就可以用AStar算法来解决这个问题了。下面是一个简单的实现：

```erlang
-module('AStar').

%% API
-export([answer/0]).

-record(open_data, {predict_distance, hash, problem}).
-record(result, {last_hash = 0, distance = 0, display = ""}).

answer() ->
  Problem = {
    3, 0, 4,
    5, 2, 8,
    1, 6, 7
  },
  Hash = erlang:phash2(Problem),
  a_star([#open_data{predict_distance = cal_dist(Problem), hash = Hash, problem = Problem}], sets:new(), #{Hash => #result{}}).

% A*算法
a_star([#open_data{hash = Hash, problem = {1, 2, 3, 4, 5, 6, 7, 8, 0}} | _], _, Result) ->
  display_result(Hash, Result);
a_star([#open_data{hash = Hash, problem = Problem} | OpenList], CloseSet, Result) ->
  #{Hash := #result{distance = Dist}} = Result,
  IndexOf0 = index_of_0(Problem),
  Directions = get_4_directions(IndexOf0),
  {NewOpenList, NewResult} = lists:foldl(
    fun(Index1, {AccOpenList, AccResult}) ->
      NewProblem = swap(Problem, IndexOf0, Index1),
      NewHash = erlang:phash2(NewProblem),
      NewAccOpenList =
        case sets:is_element(NewHash, CloseSet) of
          true -> AccOpenList;
          false -> ordsets:add_element(#open_data{predict_distance = Dist + 1 + cal_dist(NewProblem), hash = NewHash, problem = NewProblem}, AccOpenList)
        end,
      NewAccResult =
        case Result of
          #{NewHash := #result{distance = OldDist}} when Dist + 1 >= OldDist -> AccResult;
          _ -> AccResult#{NewHash => #result{last_hash = Hash, distance = Dist + 1, display = display(Problem, IndexOf0, Index1)}}
        end,
      {NewAccOpenList, NewAccResult}
    end, {OpenList, Result}, Directions),
  a_star(NewOpenList, sets:add_element(Hash, CloseSet), NewResult).

% 计算曼哈顿距离
cal_dist(Problem) ->
  lists:foldl(
    fun(Index, AccIn) ->
      case element(Index, Problem) of
        0 -> AccIn;
        H -> AccIn + abs((H - 1) div 3 - (Index - 1) div 3) + abs((H - 1) rem 3 - (Index - 1) rem 3)
      end
    end, 0, lists:seq(1, 9)).

% 找到0的坐标
index_of_0(Problem) ->
  index_of_0(Problem, 1).
index_of_0(Problem, Index) ->
  case element(Index, Problem) of
    0 -> Index;
    _ -> index_of_0(Problem, Index + 1)
  end.

% 交换Problem的两个位置的值，返回新的Problem
swap(Problem, Index1, Index1) ->
  Problem;
swap(Problem, Index1, Index2) ->
  setelement(Index2, setelement(Index1, Problem, element(Index2, Problem)), element(Index1, Problem)).

% 获取这个坐标的上下左右的坐标（仅界内，不含界外）
get_4_directions(1) -> [2, 4];
get_4_directions(2) -> [1, 3, 5];
get_4_directions(3) -> [2, 6];
get_4_directions(4) -> [1, 5, 7];
get_4_directions(5) -> [2, 4, 6, 8];
get_4_directions(6) -> [3, 5, 9];
get_4_directions(7) -> [4, 8];
get_4_directions(8) -> [5, 7, 9];
get_4_directions(9) -> [6, 8].

% 用文字展示把Index1位置的滑块移到IndexOf0位置的空位
display(Problem, IndexOf0, Index1) when IndexOf0 - Index1 == 1 ->
  integer_to_list(element(Index1, Problem)) ++ " move right";
display(Problem, IndexOf0, Index1) when IndexOf0 - Index1 == -1 ->
  integer_to_list(element(Index1, Problem)) ++ " move left";
display(Problem, IndexOf0, Index1) when IndexOf0 - Index1 == 3 ->
  integer_to_list(element(Index1, Problem)) ++ " move down";
display(Problem, IndexOf0, Index1) when IndexOf0 - Index1 == -3 ->
  integer_to_list(element(Index1, Problem)) ++ " move up".

% 输出结果
display_result(Hash, Result) ->
  case Result of
    #{Hash := #result{distance = 0}} ->
      ok;
    #{Hash := #result{last_hash = LastHash, display = Display}} ->
      display_result(LastHash, Result),
      io:format("~s~n", [Display])
  end.
```

算法不难，这里只列举了Erlang的实现，其他语言的实现也大同小异，就不一一展示了。执行一下可以看到输出：

``` :collapsed-lines=2
2 move up
6 move up
7 move left
8 move down
4 move down
2 move right
6 move up
5 move right
1 move up
7 move left
5 move down
4 move left
2 move down
6 move right
3 move right
1 move up
4 move left
2 move left
6 move down
3 move right
2 move up
5 move up
8 move left
```

::: note 注意

在AStar算法中，采用曼哈顿距离估算预计距离。这就带来了一个问题：实际剩余距离更小的状态，预估剩余距离不一定更小，因此整个算法得到的最终路径不一定是最短的路径。

但确实在向尽可能短的方向找，比普通的**广度优先遍历**要快得多。

:::

上述是以3×3的网格为例，实际上我们可以将其推广到更大的网格中，例如4×4、5×5的网格。只要我们在计算曼哈顿距离的时候，注意到每个数字的目标位置就可以了。