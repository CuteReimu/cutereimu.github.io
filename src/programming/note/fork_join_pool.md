---
title: 回溯问题的多线程解法
icon: computer
order: 2
category: 编程随笔
tags:
  - Java
date: 2019-10-17
---

[上一篇文章](concurrency.md)主要讲了一些并发编程的简单例子。本文进一步扩展，就以常见的N皇后问题，来展示一下如何对回溯问题进行多线程求解。

题目摘自LeetCode第51题：

> n 皇后问题研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。
> 
> 给定一个整数 n，返回所有不同的 n 皇后问题的解决方案。
> 
> 下图为8皇后问题的一种解法：
> 
> ![ 8 皇后问题的一种解法](/programming/8-queens.png)

首先我们从穷举考虑，每个格子只有放和不放两种情况，那么一共有2^n*n^种情况，对于每种情况进行判断，是否满足条件，满足则输出出来。看似可行，但是想一想，如果是个8皇后问题，就要遍历2^64^次，这个计算量确实有点大。

简单观察一下，可以发现，显然每一排只能放一个皇后，那么如果第一排第一个格子放了皇后之后，第一排的其他格子就不用尝试了，这样下来，遍历次数就减少为n^n^了，对于8皇后问题，减少到8^8^也就是2^24^了，确实减少了很多计算量。

再进一步考虑，如果第一排的第一个位置放了皇后，那么后面每排的第一个位置都不用考虑了。接着第二排如果放了第三个位置，那么后面每排的第三个位置都不用考虑了。这样遍历次数就变成了n!次，又大大减少了计算量。

还可以进一步考虑，如果第一排的第一个位置放了皇后，那么一条斜线都不用考虑了。不光往右斜线不用考虑了，往左斜线也不用考虑了。这样又进一步减少了计算量。

好了，上面分析了这么多，很好理解，但是用代码确实不容易写出来。怎么写呢。一行只能放一个，一列只能放一个，这个用代码很容易实现。关键问题在于斜着方向，我们继续观察一下，不难发现，同一斜线上的两个格子，行号加列号的和相等（或行号减列号的差相等）。通过这个就很好写代码了，例如，如果行号加列号等于3的格子有棋子了，那么其他行号加列号等于3的格子就不能放棋子了。这样，我们不难得到如下代码：

```java
import java.util.*;

public class Solution {
   public static void main(String[] args) {
      long time = System.currentTimeMillis();
      System.out.println(new Solution().solveNQueens(14).size());
      System.out.println("耗时：" + (System.currentTimeMillis() - time));
   }
   
   private boolean[] sum;
   private boolean[] diff;
   private boolean[] line;
   
   public List<List<String>> solveNQueens(int n) {
      sum = new boolean[n * 2 - 1];//用来存放已经放置棋子的格子的行号加列号
      diff = new boolean[n * 2 - 1];//用来存放已经放置棋子的格子的行号减列号
      line = new boolean[n];//用来存放已经放置了棋子的列
      List<List<String>> result = new ArrayList<>();
      solveNQueens(result, n, new ArrayList<>());
      return result;
   }

   private void solveNQueens(List<List<String>> result, int n, List<Integer> list) {
      //list作为回溯用的缓存，存储了每一行的第几列放置了皇后
      int j = list.size();
      if (j == n) {
         List<String> strings = new ArrayList<>();
         for (int i : list) {
            char[] ch = new char[n];
            for (int x = 0; x < n; x++)
               ch[x] = x == i ? 'Q' : '.';
            strings.add(new String(ch));
         }
         result.add(strings);
         return;
      }
      list.add(0);
      for (int i = 0; i < n; i++) {
         if (line[i]) continue;
         if (sum[i + j]) continue;
         int diffVal = i - j + n - 1;//减了可能是负值，加一个n-1使其变为非负
         if (diff[diffVal]) continue;
         //上面几行的意思很明确，如果同一列有皇后了则跳过，如果同一斜线有皇后了则跳过
         line[i] = true;
         sum[i + j] = true;
         diff[diffVal] = true;
         //上面三行用以标记这一列和这一斜线上有皇后了
         list.set(j, i);//第j行的第i列放置了皇后
         solveNQueens(result, n, list);//将list缓存传下去递归
         line[i] = false;
         sum[i + j] = false;
         diff[diffVal] = false;
         //把标记清除掉
      }
      list.remove(j);
   }
}
```

因为打印所有答案太过冗长，我们退而求其次打印了答案的数量。用14皇后进行测试，可以得到如下的结果：

```
365596
耗时：4414
```

上面就是所谓的回溯法：在递归之前，先将现在的状态标记下来，然后递归，递归后再还原回原来的状态。代码很容易看懂，不细讲。

接下来我们将它优化成多线程代码，利用前一篇文章的`ForkJoinPool`。先贴代码，对着代码说。

```java
public class Solution extends RecursiveTask<List<List<String>>> {
   public static void main(String[] args) {
      long time = System.currentTimeMillis();
      System.out.println(new Solution().solveNQueens(14).size());
      System.out.println("耗时：" + (System.currentTimeMillis() - time));
   }

   private boolean[] sum;
   private boolean[] diff;
   private boolean[] line;
   private int n;
   private List<Integer> list;
   private List<List<String>> result;

   public List<List<String>> solveNQueens(int n) {
      sum = new boolean[n * 2 - 1];//用来存放已经放置棋子的格子的行号加列号
      diff = new boolean[n * 2 - 1];//用来存放已经放置棋子的格子的行号减列号
      line = new boolean[n];//用来存放已经放置了棋子的列
      list = new ArrayList<>();//list作为回溯用的缓存，存储了每一行的第几列放置了皇后
      result = new ArrayList<>();//用以存储最后的返回值
      this.n = n;
      return compute();
   }

   public Solution() {
   }

   //拷贝构造函数
   public Solution(Solution s) {
      n = s.n;
      list = new ArrayList<>(s.list);
      sum = Arrays.copyOf(s.sum, s.sum.length);
      diff = Arrays.copyOf(s.diff, s.diff.length);
      line = Arrays.copyOf(s.line, s.line.length);
      result = new ArrayList<>();
   }

   protected List<List<String>> compute() {
      int j = list.size();
      if (j == n) {
         List<String> strings = new ArrayList<>();
         for (int i : list) {
            char[] ch = new char[n];
            for (int x = 0; x < n; x++)
               ch[x] = x == i ? 'Q' : '.';
            strings.add(new String(ch));
         }
         result.add(strings);
         return null;
      }
      List<ForkJoinTask<List<List<String>>>> tasks = new ArrayList<>();
      list.add(0);
      for (int i = 0; i < n; i++) {
         if (line[i]) continue;
         if (sum[i + j]) continue;
         int diffVal = i - j + n - 1;//减了可能是负值，加一个n-1使其变为非负
         if (diff[diffVal]) continue;
         //上面几行的意思很明确，如果同一列有皇后了则跳过，如果同一斜线有皇后了则跳过
         line[i] = true;
         sum[i + j] = true;
         diff[diffVal] = true;
         //上面三行用以标记这一列和这一斜线上有皇后了
         list.set(j, i);//第j行的第i列放置了皇后
         if (j <= 2)
            tasks.add(new Solution(this).fork());//将list缓存传下去递归
         else
            compute();//减少JoinForkPool的拆分，直接用本线程算
         line[i] = false;
         sum[i + j] = false;
         diff[diffVal] = false;
      }
      list.remove(j);
      //以下是合并解集
      for (ForkJoinTask<List<List<String>>> task : tasks) {
         List<List<String>> val = task.join();
         if (val != null)
            result.addAll(val);
      }
      return result;
   }
}
```

可以看到，优化后的代码和之前的代码很相似，区别在于，首先我们把`n`、`list`、`result`都提出来作为成员变量了，为了方便封装，这个很好理解。`compute`方法将原先的递归改为了用`JoinForkPool`的`fork`函数，新启动一个线程运算。在启动线程之前，就要将目前的缓存数据拷贝到新的对象中去，会调用上面的“拷贝构造函数”。为了不进行过多的拆分，上面的代码只在前三行进行了拆分（`j <= 2`)，这样对于14皇后问题将会拆分出14^3^个线程。（尽量减少拆分是`JoinForkPool`的一个原则，这在[上一篇文章](concurrency.md)中有讲）。

这样一来，我们就把回溯法的问题优化成了多线程解法。

测试结果如下：

```
365596
耗时：1380
```

耗时大约是之前的三分之一，还是非常令人满意的。

回溯法对于多线程优化而言很具有代表性，所以写了这篇文章来简要讲解一下。不过回溯法相对来说是一个过于简单的算法了，因此后续打算写一些大型的算法，将其进行多线程优化。一来练练手，二来和大家分享一下。不过，大型算法需要耗费非常多的篇幅来讲解，可能需要分多篇文章进行解释，还是期待我能够坚持下去了。