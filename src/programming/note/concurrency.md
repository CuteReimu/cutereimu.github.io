---
title: 并发编程漫谈
icon: computer
order: 1
category: 编程随笔
tags:
  - Java
date: 2019-08-31
star: true
---

近几年，越来越多的人都说，OOP不再像以前那么火了，事实的确是这样的。作为一个程序员，我们应该有寻根究底的习惯，而不是一味的随大流。到底是什么样的一种背景下，导致OOP的热度慢慢减退呢？面对这样一种趋势，我们应该做什么？本文的前半部分主要是对OOP和FP的简要介绍，后半部分用代码的形式举一些简单的例子来说明一下我的思考。这里要特别说明的是，本文主要还是以“科普”为主，后续的文章中才会涉及一些高端的算法。

## 前言

像C++、C#、Java这样，把事物抽象成类（class）和对象（object），通过建立这种模型来进行编程的方法就叫做面向对象的编程（OOP，Object Oriented Programming）。从很早以前，可能追溯到上个世纪90年代，一直到前几年，OOP都是非常流行的一种编程模式，把事物抽象成类和对象，确实和平时正常的思维模式很相像。对象的成员变量（或称之为域），对应着事物的一系列属性或特征；而对象的方法（或函数），正好对应了事物的行为和动作。

## 并发编程的重要性

这里要引用经典的摩尔定律（摘自百度百科）：

> 摩尔定律是由英特尔（Intel）创始人之一戈登·摩尔（Gordon Moore）提出来的。其内容为：当价格不变时，集成电路上可容纳的元器件的数目，约每隔18-24个月便会增加一倍，性能也将提升一倍。换言之，每一美元所能买到的电脑性能，将每隔18-24个月翻一倍以上。这一定律揭示了信息技术进步的速度。
> 
> 尽管这种趋势已经持续了超过半个世纪，摩尔定律仍应该被认为是观测或推测，而不是一个物理或自然法。预计定律将持续到至少2015年或2020年。然而，2010年国际半导体技术发展路线图的更新增长已经在2013年年底放缓，之后的时间里晶体管数量密度预计只会每三年翻一番。

按照目前的趋势，很难再像以前那样继续以这样的增速再提高CPU的单核性能。现在的CPU不得不更趋向于横向发展，也就是越来越多的核数。我记得我上初中那会儿，听说双核的CPU都有一种很了不起的感觉，十年过去了，到如今，我自己用的个人PC机，都是六核十二线程的。现在比较先进的i9-9980XE甚至都已经达到了16核32线程。单线程编程最多充分调用起一个核的性能，其他的核完全浪费了，在这样一种趋势下，多线程编程的重要性就越发的重要了。

随着并发编程的引入，在考虑到多个线程对同一内存进行读或写的操作时，必然会引发竞争问题，因此这些OOP语言，都有着“锁”的存在，以解决并发读写的竞争问题。在高并发的情况下，“锁”会有一个严重的诟病：不管什么类型的锁，在同一时间都只有一个线程（也可能是少量的几个线程）能够正常执行这段代码，其他线程都将阻塞住，直到持有锁的线程处理完毕，将锁释放掉。然而，因为阻塞的存在，假设逻辑处理器的个数翻了10倍，代码运行的效率并不能接近翻10倍。这个可能说的有些抽象，在文章后半段将会有例子说明。

## 一种缓解阻塞影响的方法——函数式编程

函数式编程（FP，Functionnal Programming）的重点在于函数，将一些变量（或者说就是对象）传入函数中，结果返回出来一个新的对象。换句话说，经过这个函数，原始对象不会发生任何形式的更改。展开一点说，如果想要返回一个改变了的对象，那就只能重新新建一个对象，这个对象的其他属性和原对象一模一样，部分属性按照需求是不一样的，将这个新的对象返回出来；如果这个对象经过了这个函数完全没变化，那么（作为编译器的优化）可以考虑把这个原对象的指针返回出来，因为不管任何函数都不会将对象进行任何形式的改变，所以你也不需要担心原对象变了。因为对象不会发生改变，所以也就不存在“线程”的说法了（在OOP中，线程和进程的区别在于，同一进程的不同线程之间是可以互相访问内存地址的）。

进程之间，完全通过互相发消息进行通信，这样只需要一个消息队列就可以解决这个问题。你可以简单的用一个BlockingQueue来实现消息队列，而且它的队列头只有自己进程会进行读访问，队列尾可能会有多个进程进行写访问，在这样的条件下我们还可以对这个消息队列进行一些可以想象的优化，这将会比OOP的锁的效率要高得多。

现在比较常用的函数式编程语言主要有Haskell、Clean、Erlang和Miranda等。其实，相比各个知名的OOP语言，他们都不是怎么出名。

相比于OOP，函数式编程有明显的优点和缺点：缺点很明显，每次对象发生变化都需要创建一个新的对象，这个操作相比OOP的直接修改变量的值而言会大大降低运行效率。但是他也有他独特的优点：

- 在并发编程时，不需要像OOP那样频繁的使用锁，可以有效的保证并发性能，同时避免死锁问题。这一点在多人合作的项目中的重要性尤为突出
- 进程间的通信方式比较单一，因此对进程的管理相比OOP要容易一些
- 进程间的通信方式比较单一，因此从多进程编程扩展到分布式部署也颇为容易
- 统一使用消息队列进行进程间通信，因此可以对消息队列进行有针对性的优化
- 因为不需要面向对象的思维方式，因此初学编程的人上手较快。这一点在公司人力成本上非常具有优势

我们有一句古话叫做“取长补短”，从这些函数式编程的优点中，我们能不能得到一些启发，来对我们的OOP代码进行一些优化，以方便将来对代码进行并发扩展呢？下面就来举一些简单易懂的例子，来说明一些初步的并发优化思路。

## 我们开始上代码了

前几年一直排名第一的语言就是Java了，尽管近年来被号称“无所不能”的Python反超，但是Java仍然能够稳稳把握住第二的位置。本文就以Java为例，来简要介绍一些优化思路，对于其他语言，同理类推即可。

### 第一个例子：减少使用锁

据说这是广州某游戏公司的数值策划面试题：

> 某游戏要举办一次抽卡活动，有10种不同的卡，每次抽卡可以抽到这10种卡的一张（已抽到的卡可能重复抽到），每种卡被抽到的概率都是十分之一。当玩家集齐十种卡各一张时，便可以兑换大奖（玩家是不能把卡片给别人的，并且每个玩家最多只能兑换一次大奖，也就是说抽到重复的卡只能浪费了）。请问，玩家想要抽齐一套，所需抽卡次数的数学期望。

这道题对于一个数值策划而言，是一个复杂的概率论+无穷级数求和问题，这里就不详细列出解题过程了。但是对于程序员而言，这种概率问题我们完全可以采用“暴力破解”的方法——用随机数去模拟大量玩家抽卡，把平均抽取的次数统计出来就行了。于是可以得到这样的代码：

```java
import java.util.*;

public class Test {
    private static Random rand = new Random();
    private static int count = 0;
    public static void main(String[] args) {
        long time = System.currentTimeMillis();
        cal();
        System.out.println("平均次数：" + count / 10000000.0);
        System.out.println("耗时：" + (System.currentTimeMillis() - time) / 1000.0);
    }
    private static void cal() {
        boolean[] buf = new boolean[10];
        for (int i = 0; i < 10000000; i++) {//用一千万个玩家进行模拟抽卡
            Arrays.fill(buf, false);
            for (int c = 0; c < 10;) {//十张卡抽齐则跳出循环，下一个人
                int index = rand.nextInt(10);
                count++;//每random一次，相当于抽了一张卡
                if (!buf[index]) {
                    c++;//如果抽到不重复的卡，则加一
                    buf[index] = true;
                }
            }
        }
    }
}
```
以上代码简单易懂，这里也不花费篇幅解释了。可以看到，一共模拟了1000万次。大概输出结果如下：

```
平均次数：29.2929306
耗时：3.301
```

打开任务管理器，我们可以看到CPU根本没有跑满。很显然，因为我们的CPU是多核的，单线程的情况下，最多也只能跑满一个核。
那么，怎么把这个算法变成多线程的呢？一个笨办法就是，把`count`的数据类型从`int`换成`AtomicInteger`，把`cal`方法用多个线程启动，比如100个线程，每个线程只需要模拟10万次，等所有线程都跑完再打印`count`的值。代码就变成这样：
```java
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Test {
    private static Random rand = new Random();
    private static AtomicInteger count = new AtomicInteger(0);
    private static CountDownLatch countDownLatch = new CountDownLatch(100);
    public static void main(String[] args) throws Exception {
        long time = System.currentTimeMillis();
        for (int i = 0; i < 100; i++)
            new Thread(Test::cal).start();
        countDownLatch.await();
        System.out.println("平均次数：" + count / 10000000.0);
        System.out.println("耗时：" + (System.currentTimeMillis() - time) / 1000.0);
    }
    private static void cal() {
        boolean[] buf = new boolean[10];
        for (int i = 0; i < 100000; i++) {//用十万个玩家进行模拟抽卡
            Arrays.fill(buf, false);
            for (int c = 0; c < 10;) {//十张卡抽齐则跳出循环，下一个人
                int index = rand.nextInt(10);
                count.getAndIncrement();//每random一次，相当于抽了一张卡
                if (!buf[index]) {
                    c++;//如果抽到不重复的卡，则加一
                    buf[index] = true;
                }
            }
        }
        countDownLatch.countDown();
    }
}
```

这个`CountDownLatch`是Java5就有的一个跨线程的计数器，一开始设置了100，每个子线程跑完会调用`countDown`使计数器减一，主线程跑到`await`的时候会阻塞，直到计数器减到0才会继续往下跑，打印最终的结果。代码看起来不错，而且CPU跑到了100%，看起来很完美。然而输出结果是这样的：

```
平均次数：29.2966694
耗时：36.256
```

居然耗时达到了单线程的10倍多！显然这是有问题的，那么问题出在哪了呢？

我们观察一下不难发现，整个代码中一共使用了三处锁，`AtomicInteger`，`Random`，`CountDownLatch`。其中`CountDownLatch`在整个过程中每个线程各触发了一次，使用频率很低，不需要进一步优化了。我们看看另外两个
- `AtomicInteger`是一个自旋锁，感兴趣的话可以去了解一下什么是CAS，这里我们只需要知道这里使用了锁。自旋锁在超高并发的情况下性能非常糟糕，这里100个线程同时访问，并且总计调用了约2.9亿次。
- `Random`的底层实现是这样的：首先有一个初始的随机数种子，然后每次会根据当前的种子值生成一个随机数，生成之后这个种子会变，要把变了的种子存回去。取当前的种子值、计算随机数值、把新种子存回去的过程中，其他进程可能访问和修改了这个种子，为了线程安全，这里就需要加锁了。JDK中采用了自旋锁解决这个线程安全问题，很像上面的`AtomicInteger`。同样，在本例中，100个线程同时访问，并且总计调用了约2.9亿次。

那么我们就可以根据这两个锁的问题，对代码进行优化了。

- 针对`AtomicInteger`，我们可以在每个线程自己用自己的变量来统计次数，统计结束之后，再统一加到`AtomicInteger`中。这样，100个线程最终只调用了100次`AtomicInteger`的加法运算。
- 针对`Random`，Java7提供了一个`ThreadLocalRandom`类，可以生成一个只属于本线程的`Random`对象，每个线程各自调用自己的`Random`对象，就不需要对种子加锁了。而且，用`ThreadLocalRandom`类生成的`Random`对象，把自旋锁去掉了，因为在正常使用的情况下是不会出现线程安全问题的。这样，本来需要并发访问2.9亿次的`Random`对象，我们不再需要并发访问了。
- 我的代码启动了100个线程，而我的电脑显然没有100个逻辑处理器，于是就会出现频繁的线程切换，线程切换是需要额外消耗资源的。我们完全可以只启动等于电脑逻辑处理器个数的线程，每个线程做完一个任务再做下一个任务。我们常说的“线程池”就是用来解决这个问题的。

优化后的代码如下：

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Test {
    private static AtomicInteger count = new AtomicInteger(0);
    private static CountDownLatch countDownLatch = new CountDownLatch(100);
    public static void main(String[] args) throws Exception {
        ExecutorService es = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
        long time = System.currentTimeMillis();
        for (int i = 0; i < 100; i++)
            es.submit(Test::cal);
        countDownLatch.await();
        es.shutdown();
        System.out.println("平均次数：" + count.get() / 10000000.0);
        System.out.println("耗时：" + (System.currentTimeMillis() - time) / 1000.0);
    }
    private static void cal() {
        int count = 0;
        Random rand = ThreadLocalRandom.current();
        boolean[] buf = new boolean[10];
        for (int i = 0; i < 100000; i++) {//用十万个玩家进行模拟抽卡
            Arrays.fill(buf, false);
            for (int c = 0; c < 10;) {//十张卡抽齐则跳出循环，下一个人
                int index = rand.nextInt(10);
                count++;//每random一次，相当于抽了一张卡
                if (!buf[index]) {
                    c++;//如果抽到不重复的卡，则加一
                    buf[index] = true;
                }
            }
        }
        Test.count.getAndAdd(count);
        countDownLatch.countDown();
    }
}
```

简单解释一下，`Executors.newFixedThreadPool`可以获得一个线程数固定的线程池，后面的`availableProcessors`方法可以得到电脑的逻辑处理器的个数。举个例子，我的CPU的型号是i7-8700，6核12线程的，所以这里就创建了一个12线程的线程池。

在我的电脑上，最后的运行结果是：
```
平均次数：29.2871288
耗时：0.307
```

计算速度大约是单线程代码的11倍，还是很令人满意的。

上面这个例子，总结一下：尽量**减少使用锁**。有的时候，稍微多花一点内存空间，就可以减少很多锁的使用。

### 第二个例子：不妨结合一下“分治法”

所谓分治，就是分而治之的意思。一提到这个词，我们首先想到的就是几种经典的排序算法，例如快速排序、堆排序等。我后来想了一下，感觉排序算法放在这里举例子不太合适，因为排序算法在最坏情况和最好情况下的耗时相差很大，不太好说明问题。因此我这里就换了这样一个例子：

```java
public class Test {
    public static void main(String[] args) throws Exception {
        long time = System.currentTimeMillis();
        int result = fib(45);
        System.out.println("fib(45) = " + result);
        System.out.println("耗时：" + (System.currentTimeMillis() - time) / 1000.0);
    }
    private static int fib(int i) {
        if (i <= 1) return 1;
        return fib(i - 1) + fib(i - 2);
    }
}
```

这是个很常见的斐波那契数列。斐波那契数列的正常解法是动态规划，只需要把数列的最后两个值记下来，每次累加就行。我们这里为了研究多线程性能，就直接用强行递归。结果如下：

```
fib(45)= 1836311903
耗时：3.828
```

那如何用多线程来解决这个问题呢？有这样一个思路：每次递归的时候，启动一个新的线程，用新的线程计算递归的值。顺带把上面例子中的线程池用上，可以得到这样的代码：

```java
import java.util.concurrent.*;

public class Test {
    private static ExecutorService es;
    public static void main(String[] args) throws Exception {
        es = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
        long time = System.currentTimeMillis();
        int result = fib(45);
        es.shutdown();
        System.out.println("fib(45) = " + result);
        System.out.println("耗时：" + (System.currentTimeMillis() - time) / 1000.0);
    }
    private static int fib(int i) throws Exception {
        if (i <= 1) return 1;
        Future<Integer> task1 = es.submit(() -> fib(i - 1));
        Future<Integer> task2 = es.submit(() -> fib(i - 2));
        return task1.get() + task2.get();
    }
}
```

看上去似乎没什么问题，然而运行起来之后，发现迟迟不出结果。是运算太慢了吗？我们把任务管理器打开一看，发现CPU使用率根本没有增加，这显然是程序卡在了奇怪的地方。

回忆一下之前的说的线程池，固定启动少量的线程，执行任务，其中一个任务跑完了之后，再从任务队列里取下一个任务来执行。观察我们的代码，这里我们把前一个线程阻塞住，等两个子线程返回了之后，利用返回值继续进行计算。随着我们启动的线程越来越多，而线程池的大小是一个固定值（比如我的电脑就是12），排满之后，12个线程池全部阻塞住了，并没有空余的线程再去跑新的任务了，整个程序就卡住了。

我们现在想要的是，在线程阻塞的时候，当前任务放在一边，先去执行别的任务。好在，Java给我们提供了`ForkJoinPool`（我们需要的特殊的线程池），以及`RecursiveAction`（对应`Runnable`）和`RecursiveTask`（对应`Callable`）。

```java
import java.util.concurrent.*;

public class Test extends RecursiveTask<Integer> {
    public static void main(String[] args) {
        long time = System.currentTimeMillis();
        int result = fib(45);
        System.out.println("fib(45) = " + result);
        System.out.println("耗时：" + (System.currentTimeMillis() - time) / 1000.0);
    }

   private static int fib(int i) {
       if (i <= 1) return 1;
       RecursiveTask<Integer> task1 = new Test(i - 1);
       RecursiveTask<Integer> task2 = new Test(i - 2);
       task1.fork();
       task2.fork();
       return task1.join() + task2.join();
   }

   private Test(int i) {
      this.i = i;
   }
   private int i;

   @Override
   protected Integer compute() {
      return fib(i);
   }
}
```

Java8这里做了代码上的简化，我们不再需要显式创建一个`ForkJoinPool`。它会自动创建，并且我们调用`RecursiveAction`和`RecursiveTask`的`fork`方法时，它会自动的检测当前线程所在的线程池，结果发现我们并没有使用一个符合要求的线程池，就会把新建的线程放进这个自动创建的`ForkJoinPool`去；调用`join`方法时，如果阻塞了不能立即返回值，则会把当前进程放回线程池的队列中去，换一个新的任务执行。

执行了一下试试，发现：

```
fib(45) = 1836311903
耗时：34.461
```

在多线程的情况下，竟然还是变慢了！这个结果令人感到很不愉快。这里就要提到两个技巧了：

- 重新看一下`fib`函数，不难发现，我们新启动了两个线程之后，主线程直接阻塞住了，等待子线程返回。仔细想一想，主线程似乎完全没有必要阻塞，我们可以把其中一个子线程的任务直接在主线程跑就好了，这样可以节约差不多一半的线程调度的开销。
- Task的创建和插入线程池队列都有不小的开销。我们可以发现，对于线程的拆分明显太过于频繁，没必要每次调用`fib`方法都新建一个新的任务。我们可以适当的进行优化，比如当`i < 20`时，我们就不要再拆分线程了，直接进行递归计算。

优化之后的代码如下：

```java
import java.util.concurrent.*;

public class Test extends RecursiveTask<Integer> {
    public static void main(String[] args) {
        long time = System.currentTimeMillis();
        int result = fib(45);
        System.out.println("fib(45) = " + result);
        System.out.println("耗时：" + (System.currentTimeMillis() - time) / 1000.0);
    }

    private static int fib(int i) {
        if (i <= 1) return 1;
        if (i <= 20) return fib(i - 1) + fib(i - 2);
        RecursiveTask<Integer> task2 = new Test(i - 2);
        task2.fork();
        return fib(i - 1) + task2.join();
    }

    private Test(int i) {
        this.i = i;
    }
    private int i;

    @Override
    protected Integer compute() {
        return fib(i);
    }
}
```

运行看一下结果：

```
fib(45) = 1836311903
耗时：0.662
```

相比单线程代码，快了5~6倍。

总结一下，我们得到这样一个经验：在使用分治法的时候，**减少不必要的任务创建，合理调整任务划分的粒度**。

## 后记

展望一下未来，随着CPU核数的增多，多线程编程就显得越来越重要了，这是显而易见的。另外，有了多线程编程的基础，我们很容易能把它扩展到分布式计算，无非就是多线程内存直接访问推广到不同机器间消息互通。随着5G的推广，通信延迟将大大降低，云计算一定比现在会有更广泛的用途。打个比方，我们将北京的一个机房和深圳的一个机房的计算机群连接在一起，在目前的云计算环境下，还是有一定的网络延迟的；而将来在5G的环境下，相比现在，网络延迟将会大大降低。这进一步展现了并发编程在未来的重要作用。