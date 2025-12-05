# Rust 异步编程

> [!INFO] 
> 原书为 [Async Rust](https://www.oreilly.com/catalog/errata.csp?isbn=9781098149093)。
> 由 <Icon icon="ri:deepseek-fill"/>DeepSeek V3.2 翻译，请对内容进行甄别。

## 第一章 异步编程简介

多年来，软件工程师们一直享受着硬件性能持续提升所带来的便利。“直接投入更多计算能力”或“写入时间比读取时间更昂贵”这类说法，在合理化使用低效算法、草率方法或慢速编程语言时，已成为流行的俏皮话。然而，在撰写本文时，多家微处理器制造商报告称，自2010年以来半导体技术的进步已经放缓，这导致了英伟达首席执行官黄仁勋在2022年提出的具有争议性论断：“摩尔定律已死。”随着软件需求的增加以及微服务等系统中I/O网络调用数量的增长，我们需要更有效地利用我们的资源。

这就是*异步编程*的用武之地。通过异步编程，我们无需向CPU添加额外的核心就能获得性能提升。相反，利用异步编程，我们可以在单个线程上高效地处理多个任务，前提是这些任务中存在一些空闲时间，例如等待服务器响应。

我们以异步的方式生活。例如，当我们把衣物放进洗衣机时，我们不会静止不动，什么都不做，直到机器完成工作。相反，我们会去做其他事情。如果我们希望我们的计算机和程序能高效地运行，就需要拥抱异步编程。

然而，在我们卷起袖子深入探讨异步编程的细节之前，需要理解这个话题在我们计算机的语境中处于什么位置。本章概述了线程和进程的工作原理，演示了异步编程在I/O操作中的有效性。

阅读完本章后，你应该从高层次理解什么是异步编程，而无需了解异步程序的复杂细节。你还将理解关于线程和Rust的一些基本概念；由于异步运行时使用线程来执行异步任务，这些概念会在异步编程中出现。你应该准备好探索异步程序在下一章中的具体工作原理，该章节将聚焦于异步编程更具体的示例。如果你已经熟悉进程、线程以及它们之间的数据共享，可以跳过本章。在第2章中，我们将介绍特定于异步的概念，如期物、任务以及异步运行时如何执行任务。

### 什么是异步？

当我们使用计算机时，我们期望它能同时执行多项任务。否则，我们的体验会非常糟糕。然而，想想计算机在某一时刻所做的所有任务。当我们撰写本书时，我们点击了拥有八个核心的苹果M1 MacBook的活动监视器。这台笔记本电脑在某个时刻运行着3118个线程和453个进程，而CPU使用率仅为7%。

为什么有这么多进程和线程？原因是正在运行多个应用程序、打开的浏览器标签页以及其他后台进程。那么，笔记本电脑是如何同时保持所有这些线程和进程运行的呢？关键在于：计算机并非同时运行全部3118个线程和453个进程。计算机需要调度资源。

为了演示调度资源的需求，我们可以运行一些计算密集型的代码，看看活动监视器如何变化。为了给CPU施加压力，我们采用递归计算，比如这个斐波那契数计算：

```rust
fn fibonacci(n: u64) -> u64 {
    if n == 0 || n == 1 {
        return n;
    }
    fibonacci(n-1) + fibonacci(n-2)
}
```

然后我们可以生成八个线程，并用以下代码计算第4000个数：

```rust
use std::thread;

fn main() {
    let mut threads = Vec::new();

    for i in 0..8 {
        let handle = thread::spawn(move || {
            let result = fibonacci(4000);
            println!("Thread {} result: {}", i, result);
        });
        threads.push(handle);
    }
    for handle in threads {
        handle.join().unwrap();
    }
}
```

如果我们运行这段代码，我们的CPU使用率会跃升至99.95%，但我们的进程和线程变化不大。由此我们可以推断，这些进程和线程中的大部分并非一直在使用CPU资源。

现代CPU设计非常精细。我们需要知道的是，当创建线程或进程时，会分配一部分CPU时间。然后，已创建线程或进程中的任务被调度在其中一个CPU核心上运行。该进程或线程会一直运行，直到被CPU中断或自愿让出。一旦发生中断，CPU会保存进程或线程的状态，然后切换到另一个进程或线程。

现在你从高层次理解了CPU如何与进程和线程交互，让我们看看基本的异步代码在运行。异步代码的具体细节将在下一章介绍，所以现在不需要理解每一行代码的具体工作原理，而是去体会异步代码是如何利用CPU资源的。首先，我们需要以下依赖项：

```toml
[dependencies]
reqwest = "0.11.14"
tokio = { version = "1.26.0", features = ["full"] }
```

Rust库Tokio为我们提供了一个异步运行时的高级抽象，`reqwest`使我们能够进行异步HTTP请求。由于向服务器发出请求时存在网络延迟，HTTP请求是使用异步的一个很好的、简单的现实示例。在等待网络响应时，CPU不需要做任何事情。我们可以用这段代码计时在使用Tokio作为异步运行时发出一个简单HTTP请求所需的时间：

```rust
use std::time::Instant;
use reqwest::Error;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let url = "https://jsonplaceholder.typicode.com/posts/1";
    let start_time = Instant::now();

    let _ = reqwest::get(url).await?;

    let elapsed_time = start_time.elapsed();
    println!("Request took {} ms", elapsed_time.as_millis());

    Ok(())
}
```

你的时间可能有所不同，但在撰写本文时，发出该请求大约需要140毫秒。我们可以仅仅通过复制粘贴请求再增加三个来增加请求数量，像这样：

```rust
let first = reqwest::get(url);
let second = reqwest::get(url);
let third = reqwest::get(url);
let fourth = reqwest::get(url);

let first = first.await?;
let second = second.await?;
let third = third.await?;
let fourth = fourth.await?;
```

再次运行我们的程序，我们得到了656毫秒。这是合理的，因为我们将请求数量增加了四倍。如果我们的时间少于140毫秒乘以4，结果就不合理了，因为总时间的增加将与请求数量增加四倍不成比例。

注意，虽然我们使用了异步语法，但实际上我们只是编写了同步代码。这意味着我们是在前一个请求完成后才执行下一个请求。为了使我们的代码真正异步，我们可以将任务合并起来，让它们同时运行，使用以下代码：

```rust
let (_, _, _, _) = tokio::join!(
    reqwest::get(url),
    reqwest::get(url),
    reqwest::get(url),
    reqwest::get(url),
);
```

这里我们使用了Tokio提供的宏 `tokio::join!`。这个宏使得多个任务能够并发运行。与之前的例子（请求按顺序等待）不同，这种方法允许它们同时进行。正如预期的那样，运行此代码给我们137毫秒的持续时间。在不增加线程数量的情况下，我们的程序速度提高了4.7倍！这本质上就是异步编程。通过异步编程，我们可以通过不因可以等待的任务而阻塞CPU来释放CPU资源。见图1-1。

为了帮助你理解异步编程的上下文，我们需要简要探讨一下进程和线程的工作原理。虽然我们不会在异步编程中使用进程，但理解它们如何工作以及彼此之间如何通信，对于我们理解线程和异步编程的上下文非常重要。

**图1-1. 阻塞的同步时间线与异步时间线的对比**

### 进程简介

Rust中的标准异步编程不使用多进程；然而，我们可以通过使用多进程来实现异步行为。为此，我们的异步系统必须位于一个进程内部。

让我们思考一下数据库PostgreSQL。它为每个建立的连接生成一个进程。这些进程是单线程的。如果你曾经研究过Rust的Web框架，你可能会注意到定义Rust Web服务器端点的函数是异步函数，这意味着Rust服务器不会为每个连接生成进程。相反，Rust Web服务器通常有一个线程池，传入的HTTP请求是运行在该线程池上的异步任务。我们将在第3章介绍异步任务如何与线程池交互。现在，让我们关注进程在异步编程中的位置。

进程是操作系统提供的一种抽象，由CPU执行。进程可以由程序或应用程序运行。程序的指令被加载到内存中，CPU按顺序执行这些指令以执行一个或一组任务。进程就像外部输入（例如来自用户通过键盘的输入或其他进程的数据）的线程，并且可以生成输出，如图1-2所示。

**图1-2. 进程与程序的关系**

进程与线程的不同之处在于，每个进程都有自己独立的内存空间，这是CPU管理方式的重要组成部分，因为它防止数据被破坏或泄漏到其他进程中。

进程有自己的ID，称为*进程ID（PID）*，可由计算机的操作系统监控和控制。许多程序员使用命令 `kill PID` 来终止停滞或故障的程序，却没有完全理解这个PID究竟代表什么。PID是操作系统分配给进程的唯一标识符。它允许操作系统跟踪与进程相关的所有资源，如内存使用情况和CPU时间。

回到PostgreSQL，虽然我们必须承认历史原因在“每连接一进程”的方式中起了作用，但这种方法也有一些优点。如果每个连接生成一个进程，那么我们就实现了真正的故障隔离和每个连接的内存保护。这意味着一个连接不可能访问或破坏另一个连接的内存。每个连接生成一个进程也没有共享状态，并且是一种更简单的并发模型。然而，共享状态可能导致复杂情况。例如，如果代表单个连接的两个异步任务都依赖于共享内存中的数据，我们必须引入同步原语，如锁。这些同步原语有可能增加死锁等复杂性，最终可能导致所有依赖该锁的连接陷入停顿。这些问题可能难以调试，我们将在第11章介绍测试死锁等概念。进程的更简单并发模型降低了同步复杂性的风险，但风险并未完全消除；获取外部锁（如文件锁）无论状态隔离如何仍可能导致复杂情况。进程的状态隔离也可以防止内存错误。例如，在C或C++等语言中，我们可能会有代码在使用后不释放内存，导致内存消耗不断增长，直到计算机耗尽内存。（我们将在第6章讨论内存泄漏。）如果连接运行的某些函数存在内存泄漏，整个程序的内存可能会耗尽。然而，我们可以运行具有内存限制的进程，隔离最严重的违规者。

为了说明进程与Rust中异步编程的关系，我们可以用以下布局重现四个HTTP请求的异步特性：

```
connection
    -- Cargo.toml
    -- connection
        -- src
            -- main.rs
scripts
    -- prep.sh
    -- run.sh
server
    -- Cargo.toml
    -- server
        -- src
            -- main.rs
```

在这里，我们称我们的服务器包为 `server_bin`，连接包为 `connection_bin`。我们的连接二进制文件具有与上一节相同的Tokio和 `reqwest` 依赖项。在我们的连接 `main.rs` 文件中，我们只是发出一个请求并用以下代码打印结果：

```rust
use reqwest::Error;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let url = "https://jsonplaceholder.typicode.com/posts/1";
    let response = reqwest::get(url).await?;

    if response.status().is_success() {
        let body = response.text().await?;
        println!("{}", body);
    } else {
        println!(
            "Failed to get a valid response. Status: {}",
            response.status()
        );
    }
    Ok(())
}
```

对于服务器，我们创建一个进程，每次运行二进制文件时都会发出HTTP请求，`server/main.rs` 文件内容如下：

```rust
use std::process::{Command, Output};

fn main() {
    let output: Output = Command::new("./connection_bin")
        .output()
        .expect("Failed to execute command");
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        println!("Output: {}", stdout);
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("Error: {}", stderr);
    }
}
```

在这里，我们可以看到我们的命令正在运行连接的二进制文件。我们还可以看到我们可以处理进程的输出。如果进程以0退出，则表示进程正常退出，没有任何错误。如果进程以1退出，则表示进程出错了。无论结果如何，我们序列化输出并打印。现在我们必须构建 `scripts/prep.sh` 文件，其中包含以下代码：

```bash
#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH
cd ..
cd connection && cargo build --release && cd ..
cd server && cargo build --release && cd ..
cp connection/target/release/connection_bin ./
cp server/target/release/server_bin ./
```

在这里，我们编译二进制文件并将其移动到根目录。现在我们需要编写 `scripts/run.sh` 来同时运行四个连接。首先，我们导航到根目录：

```bash
#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH
cd ..
```

然后我们在后台运行所有四个进程，获取每个进程的PID：

```bash
./server_bin &
pid1=$!
./server_bin &
pid2=$!
./server_bin &
pid3=$!
./server_bin &
pid4=$!
```

然后我们等待结果并打印退出码：

```bash
wait $pid1
exit_code1=$?
wait $pid2
exit_code2=$?
wait $pid3
exit_code3=$?
wait $pid4
exit_code4=$?
echo "Task 1 (PID $pid1) exited with code $exit_code1"
echo "Task 2 (PID $pid2) exited with code $exit_code2"
echo "Task 3 (PID $pid3) exited with code $exit_code3"
echo "Task 4 (PID $pid4) exited with code $exit_code4"
```

在运行准备脚本并使用 `time sh scripts/run.sh` 命令计时运行脚本后，我们发现时间是123毫秒，比我们的异步示例略快一些。这表明我们可以通过等待进程来实现异步行为。然而，这并不能证明进程更好。我们将使用更多资源，因为进程更消耗资源。我们的标准异步程序是一个具有多个线程的进程。由于共享内存，这可能会导致CPU调度异步任务时产生一些争用。然而，进程因为隔离性而容易被CPU调度。

在我们为所有事情都生成进程之前，我们需要考虑一些缺点。操作系统可能对可以生成的线程数量有限制，而生成进程成本更高且扩展性不佳。一旦我们开始使用所有核心，额外生成的进程将开始被阻塞。我们还必须理解移动部件的数量；进程间通信可能因为需要序列化而变得昂贵。有趣的是，我们的进程中也有异步代码，这很好地展示了进程所处的位置。在PostgreSQL中，连接是一个进程，但该进程包含运行命令和访问数据存储的异步代码。

为了减少移动部件的数量，我们可以使用Tokio的异步任务来指向我们启动的进程：

```rust
let mut handles = vec![];
for _ in 0..4 {
    let handle = tokio::spawn(async {
        let output = Command::new("./connection_bin")
            .output()
            .await;
        match output {
            Ok(output) => {
                println!(
                    "Process completed with output: {}",
                    String::from_utf8_lossy(&output.stdout)
                );
                Ok(output.status.code().unwrap_or(-1))
            }
            Err(e) => {
                eprintln!("Failed to run process: {}", e);
                Err(e)
            }
        }
    });
    handles.push(handle);
}
```

然后我们处理进程结果：

```rust
let mut results = Vec::with_capacity(handles.len());
for handle in handles {
    results.push(handle.await.unwrap());
}
for (i, result) in results.into_iter().enumerate() {
    match result {
        Ok(exit_code) => println!(
            "Process {} exited with code {}",
            i + 1, exit_code
        ),
        Err(e) => eprintln!(
            "Process {} failed: {}",
            i + 1, e
        ),
    }
}
```

虽然这减少了移动部件的数量，但我们仍然面临着进程的扩展性问题，以及进程和主程序之间序列化数据的开销。因为Rust是内存安全的，并且我们可以将错误作为值来处理，所以进程背后的隔离优势并不那么强。例如，除非我们主动编写不安全的Rust代码，否则我们不会在其中一个线程中发生内存泄漏。

记住我们希望通过异步编程实现什么：我们想要生成轻量级、非阻塞的任务并等待它们完成。在很多情况下，我们希望从这些任务中获取数据并使用它们。我们还希望能够选择将任务与数据一起发送到异步运行时。由于线程之间共享数据的便利性，对于异步编程而言，线程似乎是比进程好得多的选择。我们接下来将介绍线程。

### 什么是线程？

执行线程是CPU可以执行的最小的程序指令序列。线程可以由调度器独立管理。在一个进程内部，我们可以在多个线程之间共享内存（图1-3）。

**图1-3. 线程与进程的关系**

虽然线程和异步任务都由调度器管理，但它们不同。线程可以在不同的CPU核心上同时运行，而异步任务通常轮候使用CPU。我们将在第2章更详细地介绍异步任务。

为了启动线程，我们可以重新审视我们的斐波那契数递归函数，并在四个线程上分摊斐波那契数的计算。首先，需要导入：

```rust
use std::time::Instant;
use std::thread;
```

然后我们可以在主函数中计时计算第50个斐波那契数所需的时间：

```rust
let start = Instant::now();
let _ = fibonacci(50);
let duration = start.elapsed();
println!("Fibonacci(50) in {:?}", duration);
```

接下来，我们可以重置计时器并计算在四个线程上计算四个第50个斐波那契数所需的时间。我们通过迭代四次来生成四个线程并将每个 `JoinHandle` 附加到一个向量中来实现多线程：

```rust
let start = Instant::now();
let mut handles = vec![];
for _ in 0..4 {
    let handle = thread::spawn(|| {
        fibonacci(50)
    });
    handles.push(handle);
}
```

`JoinHandle` 允许你等待线程完成，暂停程序直到该线程结束。连接线程意味着阻塞程序直到线程终止。`JoinHandle` 实现了 `Send` 和 `Sync` trait，这意味着它可以在线程之间发送。然而，`JoinHandle` 没有实现 `Clone` trait。这是因为每个线程需要一个唯一的 `JoinHandle`。如果一个线程有多个 `JoinHandle`，你可能会遇到多个线程试图连接正在运行的线程的风险，从而导致数据竞争。

如果你使用过其他编程语言，你可能遇到过绿色线程。这些线程是由操作系统以外的东西（例如，运行时或虚拟机）调度的。Rust最初在1.0版本之前实现了绿色线程。移除它们并转向原生线程、将绿色线程留在库中的主要原因是，在Rust中，线程和I/O操作是耦合的，这迫使原生线程和绿色线程拥有并维护相同的API。这导致了使用I/O操作和指定分配时的各种问题。有关更多信息，请参阅Rust关于绿色线程的文档。请注意，虽然Rust本身不实现绿色线程，但像Tokio这样的运行时确实实现了。

现在我们有了 `JoinHandle` 的向量，我们可以等待它们执行，然后打印花费的时间：

```rust
for handle in handles {
    let _ = handle.join();
}
let duration = start.elapsed();
println!("4 threads fibonacci(50) took {:?}", duration);
```

运行我们的程序得到以下输出：

```
fibonacci(50) in 39.665599542s
4 threads fibonacci(50) took 42.601305333s
```

我们可以看到，在Rust中使用线程时，多个CPU密集型任务可以同时处理。因此，我们可以推断多个线程也可以并发地处理等待。即使我们不使用斐波那契计算的结果，我们也可以在主程序中使用线程的结果，如果我们想要的话。在这个例子中，当我们调用 `JoinHandle` 的 `join` 时，我们返回一个 `Result<u64, Box<dyn Any + Send>>`。`u64` 是线程计算的斐波那契数的结果。`Box<dyn Any + Send>>` 是一个动态trait对象，提供了处理各种类型错误的灵活性。这些错误类型需要发送过来，但线程出错的原因可能有很多。然而，这种方法也有一些开销，因为我们需要动态向下转型和装箱，因为我们不知道编译时的大小。

线程还可以通过程序内的内存直接相互交互。本章的最后一个例子使用通道，但现在我们可以使用 `Arc`、`Mutex` 和一个 `Condvar` 来创建图1-4中描述的系统。

**图1-4. 一个Condvar通知另一个线程发生更改**

在这里，我们将有两个线程。一个线程将更新 `Condvar`，另一个线程将监听 `Condvar` 的更新，并在更新发生时打印出文件发生了更新。然而，在编写任何代码之前，我们需要建立以下结构体：

**Arc**  
这代表原子引用计数，意味着 `Arc` 统计对包装在 `Arc` 中的变量的引用次数。所以，如果我们定义一个 `Arc<i32>`，然后在四个线程中引用它，引用计数将增加到四。只有当所有四个线程都完成对它的引用，导致引用计数为零时，`Arc<i32>` 才会被丢弃。

**Mutex**  
记住，Rust只允许我们在任何给定时间拥有一个对变量的可变引用。`Mutex`（互斥锁）是一种智能指针类型，通过将值放在 `Mutex` 内部来提供内部可变性。这意味着我们可以跨多个线程提供对单个变量的可变访问。这是通过线程获取锁来实现的。当我们获取锁时，我们获得对 `Mutex` 内部值的单一可变引用。我们执行一个事务，然后释放锁以允许其他线程执行事务。锁确保一次只有一个线程拥有对可变引用的访问权，确保不违反Rust的“一次只能有一个可变引用”的规则。获取锁需要一些开销，因为我们可能需要等待它被释放。

**Condvar**  
条件变量的缩写，允许我们的线程睡眠，并在通过 `Condvar` 发送通知时被唤醒。我们不能通过 `Condvar` 发送变量，但多个线程可以订阅同一个 `Condvar`。

现在我们已经介绍了我们将要使用的内容，我们可以通过最初导入以下内容来构建我们的系统：

```rust
use std::sync::{Arc, Condvar, Mutex};
use std::thread;
use std::time::Duration;
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::Relaxed;
```

在我们的主函数内部，然后我们可以定义要在两个线程之间共享的数据：

```rust
let shared_data = Arc::new((Mutex::new(false), Condvar::new()));
let shared_data_clone = Arc::clone(&shared_data);
let STOP = Arc::new(AtomicBool::new(false));
let STOP_CLONE = Arc::clone(&STOP);
```

这里我们有一个包装在 `Arc` 中的元组。我们将要更新的布尔变量包装在 `Mutex` 中。然后我们克隆我们的数据包，以便两个线程都可以访问共享数据。`shared_data_clone` 线程传递给 `background_thread`，而原始的 `shared_data` 保留在主线程中，稍后在 `updater_thread` 中使用。如果不克隆，`shared_data` 的所有权将被移动到传递给它的第一个线程，主线程将失去对它的访问权。

现在我们的数据可用了，我们可以定义我们的第一个线程：

```rust
let background_thread = thread::spawn(move || {
    let (lock, cvar) = &*shared_data_clone;
    let mut received_value = lock.lock().unwrap();
    while !STOP.load(Relaxed) {
        received_value = cvar.wait(received_value).unwrap();
        println!("Received value: {}", *received_value);
    }
});
```

在这里，我们可以看到我们等待 `Condvar` 通知。在等待的时刻，线程被称为已停放。这意味着线程被阻塞，没有执行。一旦来自 `Condvar` 的通知到达，线程在被 `Condvar` 唤醒后访问 `Mutex` 中的变量。然后我们打印出变量，线程再次进入睡眠。我们依赖 `AtomicBool` 为 `false` 来无限循环。这使我们能够在需要时停止线程。

我们在代码中大量使用 `unwrap`。这保持了代码的简洁性，以便我们可以专注于异步的主要概念，但请记住生产代码应该进行错误处理。唯一可以接受使用 `unwrap()` 的时候可能是锁定互斥锁时，因为唯一会引发恐慌的原因是在持有锁时前一个线程恐慌了，这被称为锁中毒。

在下一个线程中，我们只执行四次迭代就完成线程：

```rust
let updater_thread = thread::spawn(move || {
    let (lock, cvar) = &*shared_data;
    let values = [false, true, false, true];

    for i in 0..4 {
        let update_value = values[i as usize];
        println!("Updating value to {}...", update_value);
        *lock.lock().unwrap() = update_value;
        cvar.notify_one();
        thread::sleep(Duration::from_secs(4));
    }
    STOP_CLONE.store(true, Relaxed);
    println!("STOP has been updated");
    cvar.notify_one();
});

updater_thread.join().unwrap();
```

我们更新值，然后通知另一个线程值已更改。然后我们阻塞主程序直到 `updater_thread` 完成。

注意我们使用了 `Relaxed` 这个术语。确保操作以特定顺序发生以避免数据竞争和奇怪的差异至关重要。这就是内存排序的作用所在。与 `AtomicBool` 一起使用的 `Relaxed` 排序确保原子变量的操作对所有线程可见，但不强制规定周围操作的任何特定顺序。这对于我们的例子来说足够了，因为我们只需要检查 `STOP` 的值，而不关心其他操作的严格顺序。

运行程序会得到以下输出：

```
Updating value to false...
Received value: false
Updating value to true...
Received value: true
Updating value to false...
Received value: false
Updating value to true...
Received value: true
```

我们的更新程序线程正在更新共享数据的值，并通知我们的第一个线程访问它。

这些值是一致的，这正是我们想要的，尽管不可否认，这是我们可能描述的异步行为的粗糙实现。线程停止并等待更新。为 `updater_thread` 添加多个 `Condvar` 来循环检查和响应，会导致一个线程跟踪多个任务并在它们更改时采取行动。虽然这肯定会在网上引发关于这是否是真正的异步行为的争论，但我们当然可以说这不是实现异步编程的最佳或标准方式。然而，我们可以看到线程是异步编程的关键构建块。异步运行时以允许在单个线程内并发运行多个异步操作的方式来处理任务。这个线程通常与主线程分开。运行时也可以有多个执行任务的线程。在下一节中，我们将使用异步代码的标准实现。

### 我们可以在哪里使用异步？

我们已经向你介绍了异步编程，并在示例中（例如多个HTTP请求）演示了它的一些好处。这些是为了展示异步的强大而设计的简单示例。本节介绍异步的真实应用场景，以及你可能想在下一个项目中包含它们的原因。

首先，想想我们可以将异步用于什么。毫不奇怪，主要的用例涉及那些在执行某事或接收某事时存在延迟或潜在延迟的操作——例如，对文件系统的I/O调用或网络请求。异步允许调用这些操作的程序继续运行而不被阻塞，否则可能导致程序挂起且响应性降低。

与内存操作相比，像写入文件这样的I/O操作被认为是缓慢的，因为它们通常依赖于外部设备，如硬盘驱动器。大多数硬盘驱动器仍然依赖需要物理移动的机械部件，因此它们比RAM或CPU中的电子操作慢。此外，数据从CPU传输到设备的速度可能受限——例如，受USB连接的限制。

为了正确理解这一点，让我们比较一下涉及的时间尺度：

**纳秒 (ns)**  
这是十亿分之一秒（1/1,000,000,000秒）。CPU和内存内部的操作通常在纳秒级发生。例如，访问RAM中的数据可能需要大约100纳秒。

**毫秒 (ms)**  
这是千分之一秒（1/1,000秒）。I/O操作，如写入硬盘驱动器或通过网络发送数据，通常以毫秒为单位发生。例如，向传统硬盘驱动器写入数据可能需要几毫秒。

这些差异可能看起来微不足道，但在计算世界中，它们却是巨大的。CPU可以在打开单个文件所需的时间内执行数百万次操作。这就是为什么I/O操作通常是程序性能的瓶颈。

在撰写本文时，异步文件读取实际上并没有因异步而加快速度。这是因为文件I/O操作仍然受磁盘性能的限制，所以瓶颈在于磁盘的写入和读取速度，而不是CPU。然而，异步可以确保的是，当你的文件I/O正在进行时，你的程序可以继续运行，并且不会被这些操作阻塞。

我们现在将通过一个使用异步进行文件I/O程序的示例。想象一下，我们需要跟踪文件的更改，并在检测到文件更改时执行操作。

#### 使用异步进行文件I/O

为了跟踪文件更改，我们需要一个线程中的循环来检查文件的元数据，然后在文件元数据发生变化时反馈给主线程中的主循环，如图1-5所示。

**图1-5. 文件监控流程**

我们可以执行各种操作，但为了本练习的目的，我们将把内容打印到控制台。在我们开始处理图1-5中的组件之前，需要导入以下结构体和trait：

```rust
use std::path::PathBuf;
use tokio::fs::File as AsyncFile;
use tokio::io::AsyncReadExt;
use tokio::sync::watch;
use tokio::time::{sleep, Duration};
```

我们将在使用时介绍这些结构体和trait的用途。参考图1-5，首先处理文件操作，然后处理主循环是有意义的。我们最简单的操作是用一个函数读取文件：

```rust
async fn read_file(filename: &str) -> Result<String, std::io::Error> {
    let mut file = AsyncFile::open(filename).await?;
    let mut contents = String::new();
    file.read_to_string(&mut contents).await?;
    Ok(contents)
}
```

我们打开文件并将内容读取到一个字符串中，然后返回该字符串。但是，请注意，在撰写本文时，异步文件读取的标准实现并不是异步的。相反，它是阻塞的，所以文件打开操作并不是真正的异步。异步文件读取的不一致性归结于操作系统支持的文件API。例如，如果你有内核版本5.10或更高的Linux，你可以使用 `tokio-uring` crate，它将启用对文件API的真正异步I/O调用。不过，目前我们的函数完成了我们需要的工作。

现在我们可以继续到我们的循环，该循环定期检查文件的元数据：

```rust
async fn watch_file_changes(tx: watch::Sender<()>) {
    let path = PathBuf::from("data.txt");

    let mut last_modified = None;
    loop {
        if let Ok(metadata) = path.metadata() {
            let modified = metadata.modified().unwrap();

            if last_modified != Some(modified) {
                last_modified = Some(modified);
                let _ = tx.send(());
            }
        }
        sleep(Duration::from_millis(100)).await;
    }
}
```

我们可以看到我们的函数是一个异步函数，执行以下步骤：

1. 我们获取要检查的文件路径。
2. 我们将最后修改时间设置为None，因为我们还没有检查文件。
3. 然后我们有一个无限循环。
4. 在该循环中，我们提取文件最后修改的时间戳。
5. 如果提取的时间戳与我们缓存的时间戳不同，我们更新缓存的时间戳，并通过传递给函数的发送器通过通道发送消息。然后该消息会提醒我们的主循环文件已更新。
6. 我们忽略 `tx.send(())` 的结果，因为可能发生的唯一错误是接收器不再监听。在这种情况下，我们的函数无需再做任何事情，因此忽略结果是安全的。
7. 每次迭代，我们休眠一小段时间，这样我们就不会不断地检查我们正在监视的文件。

如果我们使用Tokio线程运行这个函数，Tokio运行时将能够切换上下文并在同一进程中执行另一个线程。如果我们使用标准库的 `sleep` 函数，线程将被阻塞。这是因为标准库的 `sleep` 不会将任务发送到Tokio执行器。我们将在第3章介绍执行器。

现在我们的第一个循环已经定义，我们可以继续在主函数中运行的循环。此时，如果你知道如何启动Tokio线程和通道，你可以尝试自己编写主函数。

如果你尝试编写自己的主函数，希望它看起来类似于以下内容：

```rust
#[tokio::main]
async fn main() {
    let (tx, mut rx) = watch::channel(()); // 1

    tokio::spawn(watch_file_changes(tx)); // 2

    loop { // 3
        // Wait for a change in the file
        let _ = rx.changed().await; // 4

        // Read the file and print its contents to the console
        if let Ok(contents) = read_file("data.txt").await { // 5
            println!("{}", contents);
        }
    }
}
```

我们的主函数执行以下步骤：

1. 我们创建一个通道，这是一个单生产者、多消费者的通道，只保留最后设置的值。该通道允许一个生产者向多个消费者发送消息，实现并发数据分发。
2. 我们将该通道的发送器传递给我们正在一个Tokio线程中运行的文件监视函数，该线程是我们启动的。
3. 现在我们的文件监视循环正在运行，我们进入我们的循环，该循环将保持直到通道中的值发生变化。
4. 因为我们不关心来自通道的值，我们用下划线表示变量赋值。我们的主循环将停留在那里，直到通道内的值因文件的元数据变化而改变。
5. 一旦通道内的值由于文件的元数据变化而改变，循环交互的其余部分将执行，读取文件并打印内容。

在运行之前，我们需要在项目根目录（`Cargo.toml` 旁边）有一个 `data.txt` 文件。然后我们可以运行系统，在IDE中打开 `data.txt` 文件，并在文件中输入内容。一旦保存文件，你将在控制台看到其内容被打印出来！

现在我们已经在本地方使用了异步编程，我们可以回到使用网络实现异步编程。

### 使用异步提高HTTP请求性能

I/O操作不仅涉及读写文件，还包括从API获取信息、对数据库执行操作或从鼠标或键盘接收信息。将它们联系在一起的是，这些操作比可以在RAM中执行的内存操作慢。异步允许程序继续运行，而不会被正在进行的操作阻塞。在等待异步操作时，可以执行其他任务。

在下面的示例中，假设用户已登录网站，我们希望在显示一些数据的同时显示自该用户登录以来的时间。为了获取数据，我们将使用一个提供特定延迟的外部API。一旦接收到这些数据，我们需要对其进行处理，因此我们将定义一个 `Response` 结构体，并用 `Deserialize` trait 注解它，以便能够将API数据反序列化为可用的对象。

为了进行API调用，我们将使用 `reqwest` 包。由于我们将处理JSON数据，我们将在依赖配置中指定 `features=["json"]` 来启用 `reqwest` 的JSON功能。这使我们能够在发出API请求和处理响应时方便地处理JSON数据。

我们需要将这些依赖项添加到 `Cargo.toml`：

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

接下来，我们导入所需的库并定义 `Response` 结构体：

```rust
use reqwest::Error;
use serde::Deserialize;
use tokio::time::sleep;
use std::time::Duration;
use std::time::Instant;
use serde_json;

#[derive(Deserialize, Debug)]
struct Response {
    url: String,
    args: serde_json::Value,
}
```

我们现在实现 `fetch_data` 函数。当被调用时，它向 `https://httpbin.org/delay/` 发送GET请求，该请求将在指定的秒数后返回响应。在我们的示例中，我们将延迟设置为5秒，以强调在现实场景中设计一个能够有效处理延迟的程序的重要性：

```rust
async fn fetch_data(seconds: u64) -> Result<Response, Error> {
    let request_url = format!("https://httpbin.org/delay/{}", seconds);
    let response = reqwest::get(&request_url).await?;
    let delayed_response: Response = response.json().await?;
    Ok(delayed_response)
}
```

在获取数据的同时，我们创建一个计算自用户登录以来时间的函数。这通常需要检查数据库，但我们将通过设置1秒的睡眠来模拟检查所需的时间。这简化了示例，我们不需要进行数据库设置：

```rust
async fn calculate_last_login() {
    sleep(Duration::from_secs(1)).await;
    println!("Logged in 2 days ago");
}
```

现在我们把代码组合起来：

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    let start_time = Instant::now();
    let data = fetch_data(5);
    let time_since = calculate_last_login();
    let (posts, _) = tokio::join!(
        data, time_since
    );
    let duration = start_time.elapsed();
    println!("Fetched {:?}", posts);
    println!("Time taken: {:?}", duration);
    Ok(())
}
```

让我们检查输出：

```
Fetched Ok(Response { url: "https://httpbin.org/delay/5", args: Object {} })
Time taken: 5.494735083s
```

在主函数中，我们在调用 `calculate_last_login` 函数之前，通过使用 `fetch_data` 函数发起API调用。API请求设计为需要5秒才能返回响应。由于 `fetch_data` 是一个异步函数，它以非阻塞方式执行，允许程序继续执行。因此，`calculate_last_login` 被执行，其输出首先打印到终端。在5秒延迟之后，`fetch_data` 完成，其结果被返回并打印。

与我们最初的HTTP请求示例不同，这演示了异步编程如何允许任务并发执行而不阻塞程序的流程，导致网络请求以无序方式完成。因此，只要我们在需要数据的顺序上等待每个请求，我们就可以将异步用于多个网络请求。

### 总结

在本章中，我们介绍了异步编程，以及它与计算机系统中线程和进程的关系。然后我们介绍了与线程和进程进行基本的高层次交互，以证明线程在异步编程中是有用的。接着我们探索了基本的高层次异步编程，通过在处理其他请求的响应的同时发送更多请求来提高多个HTTP调用的性能。我们还使用异步原则来跟踪文件更改。

我们希望本章展示了异步是同时处理多个不需要持续CPU时间的任务的强大工具。因此，异步使我们能够用一个线程同时处理多个任务。现在你理解了异步编程在计算机系统语境中的位置，我们将在第2章探讨基本的异步编程概念。

## 第二章 基础异步 Rust

本章介绍在 Rust 中使用异步的重要组件，并提供任务、期物、`async` 和 `await` 的概述。我们将涵盖上下文、固定、轮询和闭包——这些是充分利用 Rust 中异步编程的重要概念。我们选择本章的示例是为了演示学习要点；它们不一定是为了追求效率。本章最后以一个示例结束，该示例构建了一个用于敏感程序的异步审计日志记录器，将所有概念整合在一起。

到本章结束时，你将能够定义任务和期物。你还将理解期物的更多技术组件，包括上下文和固定。

### 理解任务

在异步编程中，一个**任务**表示一个异步操作。基于任务的异步模式（TAP）提供了对异步代码的抽象。你将代码编写为一系列语句。你可以阅读该代码，就好像每个语句都在下一个开始之前完成。例如，让我们想一想制作一杯咖啡和一片吐司，需要以下步骤：

1.  将面包放入烤面包机
2.  给烤好的面包涂黄油
3.  用壶烧水
4.  倒牛奶
5.  放入速溶咖啡粉（虽然不是最好的，但简化了例子）
6.  倒入沸水

我们当然可以应用异步编程来加快速度，但首先我们需要将所有步骤分解为两个大的步骤，即煮咖啡和做吐司，如下所示：

1.  煮咖啡  
    a. 用壶烧水  
    b. 倒牛奶  
    c. 放入速溶咖啡  
    d. 倒入沸水
2.  做吐司  
    a. 将面包放入烤面包机  
    b. 给烤好的面包涂黄油

即使我们每个人都只有一双手，我们也可以同时运行这两个步骤。我们可以烧水，在水烧开的同时，我们可以把面包放进烤面包机。我们有一些空闲时间等待水壶和烤面包机，所以如果我们想更有效率，并且可以接受因为水瞬间烧开而导致在加入咖啡和牛奶之前就倒入了沸水的风险，我们可以将步骤分解得更细，如下所示：

1.  准备咖啡杯  
    a. 倒牛奶  
    b. 放入速溶咖啡
2.  煮咖啡  
    a. 用壶烧水  
    b. 倒入沸水
3.  做吐司  
    a. 将面包放入烤面包机  
    b. 给烤好的面包涂黄油

在等待烧水和烤面包的同时，我们可以执行倒牛奶和加咖啡的步骤，从而减少空闲时间。首先，我们可以看到步骤并不是目标特定的。当我们走进厨房时，我们会想“做吐司”和“煮咖啡”，这是两个独立的目标。但我们为这两个目标定义了三个步骤。步骤是关于你可以异步运行哪些操作以实现所有目标。

注意，在假设和我们愿意容忍什么方面存在权衡。例如，在加入牛奶和咖啡之前倒入沸水可能是完全不可接受的。如果水壶烧开没有延迟，这就是一个风险。然而，我们可以安全地假设会有延迟。

现在你理解了步骤是什么，我们可以回过头来使用像 Tokio 这样的高级 crate，它使我们能够专注于步骤的概念以及它们与任务的关系。别担心——当我们深入研究低级概念时，我们将在后面的章节中使用其他 crate。首先，我们需要导入以下内容：

```rust
use std::time::Duration;
use tokio::time::sleep;
use std::thread;
use std::time::Instant;
```

我们使用 Tokio 的 `sleep` 函数来处理我们可以等待的步骤，例如烧水壶和烤面包。因为 Tokio 的 `sleep` 函数是非阻塞的，我们可以在水烧开或面包在烤的时候切换到另一个步骤。我们使用 `thread::sleep` 来模拟一个需要我们双手的步骤，因为我们在倒牛奶/水或给吐司涂黄油时不能做其他事情。一般来说，编程这些步骤将是 CPU 密集型的。然后我们可以用以下代码定义准备咖啡杯的步骤：

```rust
async fn prep_coffee_mug() {
    println!("Pouring milk...");
    thread::sleep(Duration::from_secs(3));
    println!("Milk poured.");
    println!("Putting instant coffee...");
    thread::sleep(Duration::from_secs(3));
    println!("Instant coffee put.");
}
```

然后我们定义“煮咖啡”步骤：

```rust
async fn make_coffee() {
    println!("Boiling kettle...");
    sleep(Duration::from_secs(10)).await;
    println!("Kettle boiled.");
    println!("Pouring boiled water...");
    thread::sleep(Duration::from_secs(3));
    println!("Boiled water poured.");
}
```

我们定义最后一个步骤：

```rust
async fn make_toast() {
    println!("Putting bread in toaster...");
    sleep(Duration::from_secs(10)).await;
    println!("Bread toasted.");
    println!("Buttering toasted bread...");
    thread::sleep(Duration::from_secs(5));
    println!("Toasted bread buttered.");
}
```

你可能已经注意到，`await` 用于表示非密集型且我们可以等待的步骤的 Tokio 睡眠函数上。我们使用 `await` 关键字来暂停步骤的执行，直到结果准备就绪。当遇到 `await` 时，异步运行时可以切换到另一个异步任务。

你可以在 Rust RFC 书籍网站上阅读更多关于 `async` 和 `await` 语法的内容。

现在我们已经定义了所有步骤，我们可以用以下代码异步运行它们：

```rust
#[tokio::main]
async fn main() {
    let start_time = Instant::now();
    let coffee_mug_step = prep_coffee_mug();
    let coffee_step = make_coffee();
    let toast_step = make_toast();

    tokio::join!(coffee_mug_step, coffee_step, toast_step);
    let elapsed_time = start_time.elapsed();
    println!("It took: {} seconds", elapsed_time.as_secs());
}
```

在这里，我们定义了我们的步骤，它们被称为期物。我们将在下一节介绍期物。现在，将期物视为某个可能尚未完成的东西的占位符。然后我们等待我们的步骤完成，然后打印出所花费的时间。如果我们运行程序，会得到以下输出：

```
Pouring milk...
Milk poured.
Putting instant coffee...
Instant coffee put.
boiling kettle...
putting bread in toaster...
kettle boiled.
pouring boiled water...
boiled water poured.
bread toasted.
buttering toasted bread...
toasted bread buttered.
It took: 24 seconds
```

这个打印输出有点冗长，但它很重要。我们可以看到它看起来有点奇怪。如果我们讲求效率，我们不会先开始倒牛奶和加咖啡。相反，我们会先烧开水壶，把面包放进烤面包机，然后再去倒牛奶。我们可以看到，准备杯子的步骤首先被传入了 `tokio::join` 宏。如果我们再次运行程序，准备杯子的步骤将始终是第一个执行的期物。现在，如果我们回到准备杯子的函数，只需在其余过程之前添加一个非阻塞的睡眠函数：

```rust
async fn prep_coffee_mug() {
    sleep(Duration::from_millis(100)).await;
    ...
}
```

这给了我们以下打印输出：

```
boiling kettle...
putting bread in toaster...
Pouring milk...
Milk poured.
Putting instant coffee...
Instant coffee put.
bread toasted.
buttering toasted bread...
toasted bread buttered.
kettle boiled.
pouring boiled water...
boiled water poured.
It took: 18 seconds
```

好的，现在顺序合理了：我们在烧水，放面包到烤面包机，然后倒牛奶，结果我们节省了 6 秒。然而，因果关系是反直觉的。添加一个额外的睡眠函数减少了我们的总时间。这是因为那个额外的睡眠函数允许异步运行时切换上下文到其他任务并执行它们，直到它们的 `await` 行被执行，依此类推。在期物中插入人为延迟以使其他期物开始执行的这种做法，非正式地被称为协作式多任务处理。

当我们将期物传入 `tokio::join` 宏时，所有异步表达式在同一任务中并发求值。`join` 宏不创建任务；它只是允许在任务内并发执行多个期物。例如，我们可以用以下代码生成一个任务：

```rust
let person_one = tokio::task::spawn(async {
    prep_coffee_mug().await;
    make_coffee().await;
    make_toast().await;
});
```

任务中的每个期物都将阻塞该任务的进一步执行，直到期物完成。所以，假设我们使用以下注解来确保运行时只有一个工作线程：

```rust
#[tokio::main(flavor = "multithread", worker_threads = 1)]
```

我们创建两个任务，每个代表一个人，这将导致 36 秒的运行时间：

```rust
let person_one = tokio::task::spawn(async {
    let coffee_mug_step = prep_coffee_mug();
    let coffee_step = make_coffee();
    let toast_step = make_toast();
    tokio::join!(coffee_mug_step, coffee_step, toast_step);
}).await;

let person_two = tokio::task::spawn(async {
    let coffee_mug_step = prep_coffee_mug();
    let coffee_step = make_coffee();
    let toast_step = make_toast();
    tokio::join!(coffee_mug_step, coffee_step, toast_step);
}).await;
```

我们可以用 `join` 而不是阻塞期物来重新定义任务：

```rust
let person_one = tokio::task::spawn(async {
    let coffee_mug_step = prep_coffee_mug();
    let coffee_step = make_coffee();
    let toast_step = make_toast();
    tokio::join!(coffee_mug_step, coffee_step, toast_step);
});

let person_two = tokio::task::spawn(async {
    let coffee_mug_step = prep_coffee_mug();
    let coffee_step = make_coffee();
    let toast_step = make_toast();
    tokio::join!(coffee_mug_step, coffee_step, toast_step);
});

let _ = tokio::join!(person_one, person_two);
```

连接两个代表人的任务将导致 28 秒的运行时间。连接三个代表人的任务将导致 42 秒的运行时间。考虑到每个任务的总阻塞时间是 14 秒，时间的增加是合理的。我们可以从时间的线性增长推断出，尽管三个任务被发送到异步运行时并放入队列，但执行器在遇到 `await` 时会将任务设置为空闲，并在轮询空闲任务的同时处理队列中的下一个任务。

异步运行时可以有多个工作线程和队列，我们将在第3章探讨编写我们自己的运行时。考虑到我们在本节中介绍的内容，我们可以给出以下任务定义：

> 任务是一个异步计算或操作，由执行器管理并驱动至完成。它表示期物的执行，并且可能涉及多个期物被组合或链接在一起。

现在让我们讨论一下什么是期物。

### 期物

异步编程的关键特性之一是**期物**的概念。我们提到过，期物是一个占位符对象，表示尚未完成的异步操作的结果。期物允许你启动一个任务，并在任务在后台执行的同时继续其他操作。

为了真正理解期物如何工作，我们将介绍它的生命周期。当期物被创建时，它是空闲的。它尚未执行。当期物被执行时，它可以产生一个值、完成（resolve），或者因为期物是挂起状态（等待结果）而进入睡眠状态。当期物再次被轮询时，轮询可以返回 `Pending` 或 `Ready` 结果。期物将继续被轮询，直到它要么完成，要么被取消。

为了说明期物如何工作，让我们构建一个基本的计数器期物。它将计数到5，然后准备就绪。首先，我们需要导入以下内容：

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};
use std::time::Duration;

use tokio::task::JoinHandle;
```

你应该能理解这段代码的大部分内容。我们将在构建基础期物后介绍 `Context` 和 `Pin`。因为我们的期物是一个计数器，所以结构体采用以下形式：

```rust
struct CounterFuture {
    count: u32,
}
```

然后我们实现 `Future` trait：

```rust
impl Future for CounterFuture {
    type Output = u32;

    fn poll(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>
    ) -> Poll<Self::Output> {
        self.count += 1;
        println!("polling with result: {}", self.count);
        std::thread::sleep(Duration::from_secs(1));
        if self.count < 5 {
            cx.waker().wake_by_ref();
            Poll::Pending
        } else {
            Poll::Ready(self.count)
        }
    }
}
```

我们先不要关注 `Pin` 或 `Context`，而是整体上看 `poll` 函数。每次轮询期物时，计数增加一。如果计数达到三，我们就说明期物准备就绪。我们引入 `std::thread::sleep` 函数只是为了夸大所花费的时间，以便在运行代码时更容易跟踪这个例子。要运行我们的期物，我们只需要以下代码：

```rust
#[tokio::main]
async fn main() {
    let counter_one = CounterFuture { count: 0 };
    let counter_two = CounterFuture { count: 0 };
    let handle_one: JoinHandle<u32> = tokio::task::spawn(async move {
        counter_one.await
    });
    let handle_two: JoinHandle<u32> = tokio::task::spawn(async move {
        counter_two.await
    });
    tokio::join!(handle_one, handle_two);
}
```

在不同的任务中运行我们的两个期物会得到以下打印输出：

```
polling with result: 1
polling with result: 1
polling with result: 2
polling with result: 2
polling with result: 3
polling with result: 3
polling with result: 4
polling with result: 4
polling with result: 5
polling with result: 5
```

一个期物从队列中取出，被轮询，并被设置为空闲，而另一个期物则从任务队列中取出进行轮询。这些期物是交替轮询的。你可能已经注意到，我们的 `poll` 函数不是 `async` 的。这是因为异步的 `poll` 函数会导致循环依赖，因为你将发送一个期物进行轮询，以便解析一个正在被轮询的期物。由此可见，期物是异步计算的基石。

`poll` 函数接受一个对自身的可变引用。然而，这个可变引用被包装在一个 `Pin` 中，我们需要讨论一下这个。

### 固定期物

在 Rust 中，编译器经常在内存中移动值。例如，如果我们将一个变量移入一个函数，内存地址可能会移动。

不仅仅是移动值会导致内存地址的改变。集合类型也会改变内存地址。例如，如果一个向量达到容量，向量将不得不在内存中重新分配，从而改变内存地址。

大多数普通的基本类型，如数字、字符串、布尔值、结构体和枚举，都实现了 `Unpin` trait，使它们可以被移动。如果你不确定你的数据类型是否实现了 `Unpin` trait，可以运行一个文档命令并检查你的数据类型实现的 trait。例如，图2-1显示了标准文档中 `i32` 的自动 trait 实现。

**自动 Trait 实现**

```
impl RefUnwindSafe for i32
impl Send for i32
impl Sync for i32
impl Unpin for i32
impl UnwindSafe for i32
```

*图2-1. 文档中显示结构体或基本类型线程安全性的自动 trait 实现*

那么为什么我们要关心固定（pinning）和取消固定（unpinning）呢？我们知道期物会被移动，因为我们在生成任务时在代码中使用 `async move`。然而，移动可能是危险的。为了演示数据，我们可以构建一个引用自身的基本结构体：

```rust
use std::ptr;

struct SelfReferential {
    data: String,
    self_pointer: *const String,
}
```

`*const String` 是一个指向字符串的原始指针。这个指针直接引用 `data` 的内存地址。指针不提供任何安全保障。因此，如果指向的数据移动了，引用不会更新。我们使用原始指针来演示为什么需要固定。为了进行这个演示，我们需要定义结构体的构造函数和打印结构体引用的函数，如下所示：

```rust
impl SelfReferential {
    fn new(data: String) -> SelfReferential {
        let mut sr = SelfReferential {
            data,
            self_pointer: ptr::null(),
        };
        sr.self_pointer = &sr.data as *const String;
        sr
    }

    fn print(&self) {
        unsafe {
            println!("{}", *self.self_pointer);
        }
    }
}
```

然后通过创建 `SelfReferential` 结构体的两个实例，在内存中交换这些实例，并打印原始指针指向的数据来暴露移动结构体的危险，代码如下：

```rust
fn main() {
    let first = SelfReferential::new("first".to_string());
    let moved_first = first; // 移动结构体
    moved_first.print();
}
```

如果你尝试运行代码，可能会得到一个错误，很可能是段错误。段错误是由于访问不属于程序的内存而引起的错误。我们可以看到，移动一个引用自身的结构体可能是危险的。固定确保期物保持在固定的内存地址。这很重要，因为期物可以被暂停或恢复，这可能会改变内存地址。

我们已经涵盖了在我们定义的基础期物中几乎所有的组件。剩下的唯一组件是上下文。

### 期物中的上下文

`Context` 的作用仅仅是提供对唤醒器的访问，以唤醒任务。唤醒器是一个句柄，用于通知执行器任务已准备好运行。

虽然这是 `Context` 当前的主要角色，但值得注意的是，这个功能将来可能会发展。`Context` 的设计为扩展留下了空间，例如随着 Rust 异步生态系统的发展，引入额外的职责或功能。

让我们看一个精简版的 `poll` 函数，以便专注于唤醒期物的路径：

```rust
fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
    ....
    if self.count < 5 {
        cx.waker().wake_by_ref();
        Poll::Pending
    } else {
        Poll::Ready(self.count)
    }
}
```

唤醒器包装在上下文中，只有当轮询结果将是 `Pending` 时才使用。唤醒器本质上是在唤醒期物以便可以执行。如果期物完成，则不需要再执行任何操作。如果我们移除唤醒器并再次运行程序，会得到以下打印输出：

```
polling with result: 1
polling with result: 1
```

我们的程序没有完成，并且程序挂起。这是因为我们的任务仍然空闲，但无法再次唤醒它们以进行轮询并执行完成。期物需要 `Waker::wake()` 函数，以便在期物应该再次轮询时调用。这个过程包括以下步骤：

1.  调用期物的 `poll` 函数，结果是期物需要等待异步操作完成，然后期物才能返回值。
2.  期物通过调用引用唤醒器的方法来注册其对操作完成的通知的兴趣。
3.  执行器注意到期物对操作的兴趣，并将唤醒器存储在队列中。
4.  在稍后的某个时间，操作完成，执行器收到通知。执行器从队列中检索唤醒器，并在每个唤醒器上调用 `wake_by_ref`，唤醒期物。
5.  `wake_by_ref` 函数向应被调度执行的相关任务发出信号。具体实现方式可能因运行时不同而有所不同。
6.  当期物被执行时，执行器将再次调用期物的 `poll` 方法，期物将判断操作是否已完成，如果完成则返回值。

我们可以看到期物与 `async/await` 函数一起使用，但让我们想想它们还能怎么用。我们也可以对执行线程使用超时：当经过一定时间后线程结束，这样我们就不会有一个无限期挂起的程序。当我们有一个可能完成缓慢的函数，并且我们想提前继续或报错时，这很有用。记住，线程提供了执行任务的基础功能。我们从 `tokio::time` 导入 `timeout` 并设置一个慢任务。在这个例子中，我们将其设为睡眠10秒以夸大效果：

```rust
use std::time::Duration;
use tokio::time::timeout;

async fn slow_task() -> &'static str {
    tokio::time::sleep(Duration::from_secs(10)).await;
    "Slow Task Completed"
}
```

现在我们设置超时——在这个例子中，设为3秒。如果期物在这3秒内没有完成，线程将结束。我们匹配结果并打印 `Task timed out`：

```rust
#[tokio::main]
async fn main() {
    let duration = Duration::from_secs(3);
    let result = timeout(duration, slow_task()).await;

    match result {
        Ok(value) => println!("Task completed successfully: {}", value),
        Err(_) => println!("Task timed out"),
    }
}
```

#### 取消安全性

当我们像上一个例子那样对期物应用超时时，期物（在这个例子中是 `slow_task`）如果在指定时间内没有完成，可能会被取消。这引入了取消安全性的概念。

取消安全性确保当期物被取消时，它正在使用的任何状态或资源都能得到正确处理。如果任务在操作中间被取消，它不应该让系统处于不良状态，比如持有锁、让文件保持打开状态或部分修改数据。

在 Rust 的异步生态系统中，大多数操作默认都是取消安全的；它们可以被安全地中断而不会引起问题。然而，了解你的任务如何与外部资源或状态交互，并确保这些交互是取消安全的，仍然是一个好的做法。

在我们的例子中，如果 `slow_task()` 由于超时被取消，任务本身只是被停止，超时返回一个错误，指示任务没有及时完成。由于 `tokio::time::sleep` 是一个取消安全的操作，不存在资源泄漏或不一致状态的风险。但是，如果任务涉及更复杂的操作，例如网络通信或文件 I/O，可能需要额外小心以确保适当地处理取消。

对于 CPU 密集型工作，我们也可以将工作卸载到单独的线程池，当期物完成时解析。现在我们已经涵盖了期物的上下文。

直接轮询并不是最有效的方式，因为我们的执行器会忙于轮询尚未准备好的期物。为了解释我们如何防止忙轮询，我们将继续讨论远程唤醒期物。

### 远程唤醒期物

想象一下，我们使用异步 Rust 向另一台计算机发出网络调用。网络调用的路由和响应的接收发生在我们的 Rust 程序之外。考虑到这一点，持续轮询我们的网络期物直到我们从操作系统收到数据已到达我们正在监听的端口的信号是没有意义的。我们可以通过外部引用期物的唤醒器并在需要时唤醒期物来保持期物的轮询。

为了看到这一点，我们可以用通道模拟外部调用。首先，我们需要以下导入：

```rust
use std::pin::Pin;
use std::task::{Context, Poll, Waker};
use std::sync::{Arc, Mutex};
use std::future::Future;
use tokio::sync::mpsc;
use tokio::task;
```

有了这些导入，我们现在可以定义我们的期物，它采用以下形式：

```rust
struct MyFuture {
    state: Arc<Mutex<MyFutureState>>,
}

struct MyFutureState {
    data: Option<Vec<u8>>,
    waker: Option<Waker>,
}
```

在这里，我们可以看到我们的 `MyFuture` 的状态可以从另一个线程访问。`MyFuture` 的状态有唤醒器和数据。为了使我们的主函数更简洁，我们为 `MyFuture` 定义一个构造函数，代码如下：

```rust
impl MyFuture {
    fn new() -> (Self, Arc<Mutex<MyFutureState>>) {
        let state = Arc::new(Mutex::new(MyFutureState {
            data: None,
            waker: None,
        }));
        (
            MyFuture {
                state: state.clone(),
            },
            state,
        )
    }
}
```

对于我们的构造函数，我们可以看到我们构造了期物，但我们也返回一个对状态的引用，以便我们可以在期物外部访问唤醒器。最后，我们为我们的期物实现 `Future` trait，代码如下：

```rust
impl Future for MyFuture {
    type Output = String;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        println!("Polling the future");
        let mut state = self.state.lock().unwrap();
        if state.data.is_some() {
            let data = state.data.take().unwrap();
            Poll::Ready(String::from_utf8(data).unwrap())
        } else {
            state.waker = Some(cx.waker().clone());
            Poll::Pending
        }
    }
}
```

在这里我们可以看到，我们每次轮询期物时都打印，以跟踪我们轮询期物的次数。然后我们访问状态，看是否有任何数据。如果没有数据，我们将唤醒器传入状态，以便我们可以从期物外部唤醒期物。如果状态中有数据，我们知道我们已经准备好了，并且返回一个 `Ready`。

现在我们的期物已经准备好进行测试。在我们的主函数内部，我们创建期物、用于通信的通道，并用以下代码生成期物：

```rust
let (my_future, state) = MyFuture::new();
let (tx, mut rx) = mpsc::channel::<()>(1);
let task_handle = task::spawn(async {
    my_future.await
});
tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
println!("spawning trigger task");
```

我们可以看到我们正在睡眠三秒钟。这个睡眠给了我们时间来检查我们是否在多次轮询。如果我们的方法按预期工作，在睡眠期间应该只得到一次轮询。然后我们用以下代码生成我们的触发器任务：

```rust
let trigger_task = task::spawn(async move {
    rx.recv().await;
    let mut state = state.lock().unwrap();
    state.data = Some(b"Hello from the outside".to_vec());
    loop {
        if let Some(waker) = state.waker.take() {
            waker.wake();
            break;
        }
    }
});
tx.send(()).await.unwrap();
```

我们可以看到，一旦我们的触发器任务接收到通道中的消息，它就获取我们期物的状态，并填充数据。然后我们检查唤醒器是否存在。一旦我们获得了唤醒器，我们就唤醒期物。

最后，我们用以下代码等待两个异步任务：

```rust
let outcome = task_handle.await.unwrap();
println!("Task completed with outcome: {}", outcome);
trigger_task.await.unwrap();
```

如果我们运行我们的代码，会得到以下打印输出：

```
Polling the future
spawning trigger task
Polling the future
Task completed with outcome: Hello from the outside
```

我们可以看到，我们的轮询只发生在初始设置时，然后在我们用数据唤醒期物时又发生了一次。异步运行时设置了有效的方法来监听操作系统事件，这样它们就不必盲目地轮询期物。例如，Tokio 有一个事件循环来监听操作系统事件，然后处理它们，以便事件唤醒正确的任务。然而，在本书中，我们希望保持代码示例简单，因此我们将在 `poll` 函数中直接调用唤醒器。这是因为当我们专注于异步编程的其他领域时，我们希望减少多余的代码量。

现在我们已经介绍了如何从外部事件唤醒期物，接下来我们继续讨论期物之间的数据共享。

### 期物间共享数据

虽然这会使事情复杂化，但我们可以在期物之间共享数据。我们可能出于以下原因想在期物之间共享数据：

*   聚合结果
*   依赖计算
*   缓存结果
*   同步
*   共享状态
*   任务协调与监督
*   资源管理
*   错误传播

虽然期物间共享数据很有用，但在这样做时，我们需要注意一些事情。我们可以在处理一个简单示例时强调它们。首先，我们将依赖标准的 `Mutex` 并导入以下内容：

```rust
use std::sync::{Arc, Mutex};
use tokio::task::JoinHandle;
use core::task::Poll;
use tokio::time::Duration;
use std::task::Context;
use std::pin::Pin;
use std::future::Future;
```

我们使用标准的 `Mutex` 而不是 Tokio 版本，因为我们不想在 `poll` 函数中拥有异步功能。

对于我们的示例，我们将使用一个带有计数器的基本结构体。一个异步任务将用于增加计数，另一个任务将用于减少计数。如果两个任务访问共享数据的次数相同，最终结果将为零。因此，我们需要用以下代码构建一个基本枚举来定义正在运行的任务类型：

```rust
#[derive(Debug)]
enum CounterType {
    Increment,
    Decrement
}
```

然后我们可以用以下代码定义我们的共享数据结构体：

```rust
struct SharedData {
    counter: i32,
}

impl SharedData {
    fn increment(&mut self) {
        self.counter += 1;
    }
    fn decrement(&mut self) {
        self.counter -= 1;
    }
}
```

现在我们的共享数据结构体已经定义好了，我们可以用以下代码定义我们的计数器期物：

```rust
struct CounterFuture {
    counter_type: CounterType,
    data_reference: Arc<Mutex<SharedData>>,
    count: u32
}
```

在这里，我们定义了期物将对共享数据执行的操作类型。我们还可以访问共享数据和一个计数，以便在未来对共享数据执行的总次数达到后停止期物。

我们的 `poll` 函数的签名采用以下形式：

```rust
impl Future for CounterFuture {
    type Output = u32;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        . . .
    }
}
```

在我们的 `poll` 函数内部，我们首先处理获取对共享数据的访问，代码如下：

```rust
std::thread::sleep(Duration::from_secs(1));
let mut guard = match self.data_reference.try_lock() {
    Ok(guard) => guard,
    Err(error) => {
        println!(
            "error for {:?}: {}",
            self.counter_type, error
        );
        cx.waker().wake_by_ref();
        return Poll::Pending
    }
};
```

我们睡眠只是为了夸大差异，以便在运行程序时更容易跟踪程序的流程。然后我们使用 `try_lock`。这是因为我们使用的是标准库的 `Mutex`。使用 Tokio 版本的 `Mutex` 会很好，但请记住，我们的 `poll` 函数不能是 `async` 的。这里存在一个问题。如果我们使用标准的 `lock` 函数获取 `Mutex`，我们可以阻塞线程直到锁被获取。记住，我们的运行时中可能有一个线程处理多个任务。如果我们锁定整个线程直到 `Mutex` 被获取，就会违背异步运行时的目的。相反，`try_lock` 函数尝试获取锁，立即返回一个结果，表明锁是否被获取。如果锁没有被获取，我们打印出错误以用于教育目的，然后返回一个 `Poll::Pending`。这意味着期物将被定期轮询，直到锁被获取，这样期物就不会不必要地阻塞异步运行时。

如果我们确实获得了锁，那么我们在 `poll` 函数中继续对共享数据进行操作，代码如下：

```rust
let value = &mut *guard;

match self.counter_type {
    CounterType::Increment => {
        value.increment();
        println!("after increment: {}", value.counter);
    },
    CounterType::Decrement => {
        value.decrement();
        println!("after decrement: {}", value.counter);
    }
}
```

现在共享数据已经被修改，我们可以根据计数返回正确的响应，代码如下：

```rust
std::mem::drop(guard);
self.count += 1;
if self.count < 3 {
    cx.waker().wake_by_ref();
    return Poll::Pending
} else {
    return Poll::Ready(self.count)
}
```

我们可以看到，在考虑返回值之前，我们丢弃了守卫。这增加了守卫可供其他期物使用的时间，并使我们能够更新 `self.count`。

可以用以下代码运行两种不同变体的期物：

```rust
#[tokio::main]
async fn main() {
    let shared_data = Arc::new(Mutex::new(SharedData { counter: 0 }));
    let counter_one = CounterFuture {
        counter_type: CounterType::Increment,
        data_reference: shared_data.clone(),
        count: 0
    };
    let counter_two = CounterFuture {
        counter_type: CounterType::Decrement,
        data_reference: shared_data.clone(),
        count: 0
    };
    let handle_one: JoinHandle<u32> = tokio::task::spawn(async move {
        counter_one.await
    });
    let handle_two: JoinHandle<u32> = tokio::task::spawn(async move {
        counter_two.await
    });
    tokio::join!(handle_one, handle_two);
}
```

我们不得不运行程序几次才得到一个打印出来的错误，但当获取锁出错时，我们得到了以下打印输出：

```
after decrement: -1
after increment: 0
error for Increment: try_lock failed because the operation would block
after decrement: -1
after increment: 0
after decrement: -1
after increment: 0
```

最终结果仍然是零，所以错误没有影响整体结果。期物只是再次被轮询。虽然这很有趣，但我们可以使用第三方 crate（如 Tokio）的更高级抽象来模拟完全相同的行为，以获得更简单的实现。

### 期物间高级数据共享

我们在上一节构建的期物可以用以下异步函数替代：

```rust
async fn count(count: u32, data: Arc<tokio::sync::Mutex<SharedData>>,
    counter_type: CounterType) -> u32 {
    for _ in 0..count {
        let mut data = data.lock().await;
        match counter_type {
            CounterType::Increment => {
                data.increment();
                println!("after increment: {}", data.counter);
            },
            CounterType::Decrement => {
                data.decrement();
                println!("after decrement: {}", data.counter);
            }
        }
        std::mem::drop(data);
        std::thread::sleep(Duration::from_secs(1));
    }
    return count
}
```

在这里，我们只是循环总数，以异步方式获取锁并睡眠，以允许第二个期物对共享数据进行操作。这可以简单地用以下代码运行：

```rust
let shared_data = Arc::new(tokio::sync::Mutex::new(SharedData { counter: 0 }));
let shared_two = shared_data.clone();

let handle_one: JoinHandle<u32> = tokio::task::spawn(async move {
    count(3, shared_data, CounterType::Increment).await
});
let handle_two: JoinHandle<u32> = tokio::task::spawn(async move {
    count(3, shared_two, CounterType::Decrement).await
});
tokio::join!(handle_one, handle_two);
```

如果我们运行这个，会得到与上一节中期物完全相同的打印输出和行为。然而，显然它更简单，更容易编写。两种方法都有权衡。例如，如果我们只想编写具有我们编码行为的期物，那么只使用异步函数是有意义的。但是，如果我们需要更多地控制期物如何被轮询，或者我们无法访问异步实现，但我们有一个阻塞函数可以尝试，那么自己编写 `poll` 函数是有意义的。

### Rust 中期物与其他语言的差异

其他语言实现了用于异步编程的期物，其中一些语言依赖于回调模型。回调模型使用一个函数，当另一个函数完成时触发。这个回调函数通常作为参数传递给这个函数。这对 Rust 不起作用，因为回调模型依赖于动态分发，这意味着在运行时决定将要调用的确切函数，而不是在编译时。这产生了额外的开销，因为程序必须在运行时计算出要调用哪个函数。这违反了零成本原则，并导致性能下降。

Rust 选择了一种替代方法，旨在通过使用 `Future` trait 来优化运行时性能，该 trait 使用轮询。运行时负责管理何时调用轮询。它不需要调度回调并担心计算出要调用哪个函数，而是可以使用轮询来查看期物是否完成。这更高效，因为期物可以表示为单个堆分配中的状态机，并且状态机捕获执行异步函数所需的局部变量。这意味着每个任务有一次内存分配，而不用担心内存分配的大小不正确。这个决定确实是 Rust 编程语言的一个证明，开发者花时间使实现正确。

通常，我们不会孤立地使用 `async/await`，我们希望在任务完成时做其他事情。我们可以用特定的组合器来指定，例如 `and_then` 或 `or_else`，它们由 Tokio 提供。

### 期物如何被处理？

让我们通过高层次的步骤来讨论期物是如何被处理的：

**创建期物**  
期物可以通过多种方式创建。一种常见的方法是在函数前使用 `async` 关键字定义异步函数。然而，正如我们之前看到的，你也可以通过自己实现 `Future` trait 来手动创建期物。当我们调用异步函数时，它返回一个期物。此时，期物尚未执行任何计算，并且尚未对其调用 `await`。

**生成任务**  
我们使用 `await` 生成一个包含期物的任务，这意味着我们向执行器注册。然后，执行器负责将任务带至完成。为此，它维护一个任务队列。

**轮询任务**  
执行器通过调用 `poll` 方法处理任务中的期物。这是 `Future` trait 的一个特性，即使你编写自己的期物也需要实现。期物要么准备就绪，要么仍然挂起。

**调度下一次执行**  
如果期物没有挂起（即没有准备好），执行器将任务放回队列中，以便将来执行。

**期物完成**  
在某个时刻，任务中的所有期物都将完成，轮询将返回一个 `Ready`。我们应该注意，结果可能是一个 `Result` 或一个 `Error`。此时，执行器可以释放不再需要的任何资源，并将结果向前传递。

### 关于异步运行时的说明

必须注意，异步运行时的实现方式有不同差异，而 *Tokio* 的异步运行时要复杂得多，将在第7章介绍。

现在我们已经介绍了为什么固定期物以防止未定义行为、期物中的上下文以及期物间的数据共享。为了巩固我们所涵盖的内容，我们可以进入第3章，在那里我们将我们在任务和期物部分中涵盖的内容应用到一个实际项目中。

### 整合所有内容

现在我们已经介绍了任务和期物，以及它们与异步编程的关系。我们现在要编写一个系统，实现我们在本章中涵盖的所有内容。对于我们的问题，我们可以设想有一个服务器或守护进程接收请求或消息。接收到的数据需要记录到文件中，以备我们需要检查发生了什么。这个问题意味着我们无法预测何时会发生日志记录。例如，如果我们只是在一个单一问题中写入文件，我们的写操作可能是阻塞的。然而，从不同程序接收多个请求可能会导致相当大的开销。将写任务发送到异步运行时，并在可能时将日志写入文件是有意义的。必须注意，这个例子是出于教育目的。虽然异步写入文件对于本地应用程序可能有用，但如果你有一个旨在处理大量流量的服务器，那么你应该探索数据库选项。

在下面的例子中，我们正在为记录交互的应用程序创建一个审计跟踪。这是许多使用敏感数据（如医疗领域）的产品的重要组成部分。我们希望记录用户的操作，但我们不希望该日志记录操作阻碍程序，因为我们仍然希望提供快速的用户体验。为了使这个练习工作，你将需要以下依赖项：

```toml
[dependencies]
tokio = { version = "1.39.0", features = ["full"] }
futures-util = "0.3"
```

使用这些依赖项，我们需要导入以下内容：

```rust
use std::fs::{File, OpenOptions};
use std::io::prelude::*;
use std::sync::{Arc, Mutex};
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};
use tokio::task::JoinHandle;
use futures_util::future::join_all;
```

在这个阶段，这些内容大部分都应该能理解，你应该能够弄清楚我们为什么使用它们。我们将在整个程序中引用句柄，所以我们现在最好用以下行定义类型：

```rust
type AsyncFileHandle = Arc<Mutex<File>>;
type FileJoinHandle = JoinHandle<Result<bool, String>>;
```

由于我们不希望两个任务同时尝试写入文件，确保一次只有一个任务对文件具有可变访问权限是有意义的。

我们可能希望写入多个文件。例如，我们可能希望将所有登录写入一个文件，将错误消息写入另一个文件。如果你的系统中有医疗患者，你可能希望每个患者有一个日志文件（因为你可能需要逐个患者检查日志文件），并且你希望防止未经授权的人查看他们不允许查看的患者的操作。考虑到记录时需要多个文件，我们可以创建一个函数来创建文件或获取现有文件的句柄，代码如下：

```rust
fn get_handle(file_path: &dyn ToString) -> AsyncFileHandle {
    match OpenOptions::new().append(true).open(file_path.to_string()) {
        Ok(opened_file) => {
            Arc::new(Mutex::new(opened_file))
        },
        Err(_) => {
            Arc::new(Mutex::new(File::create(file_path.to_string()).unwrap()))
        }
    }
}
```

现在我们有了文件句柄，我们需要处理将写入日志的期物。期物的字段采用以下形式：

```rust
struct AsyncWriteFuture {
    pub handle: AsyncFileHandle,
    pub entry: String
}
```

现在我们在我们的工作示例中达到了一个阶段，我们可以为 `AsyncWriteFuture` 结构体实现 `Future` trait 并定义 `poll` 函数。我们将使用本章中涵盖的相同方法。正因为如此，你可以尝试自己编写 `Future` 实现和 `poll` 函数。希望你的实现看起来类似这样：

```rust
impl Future for AsyncWriteFuture {

    type Output = Result<bool, String>;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let mut guard = match self.handle.try_lock() {
            Ok(guard) => guard,
            Err(error) => {
                println!("error for {} : {}", self.entry, error);
                cx.waker().wake_by_ref();
                return Poll::Pending
            }
        };

        let lined_entry = format!("{}\n", self.entry);
        match guard.write_all(lined_entry.as_bytes()) {
            Ok(_) => println!("written for: {}", self.entry),
            Err(e) => println!("{}", e)
        };
        Poll::Ready(Ok(true))
    }
}
```

`Self::Output` 类型不是特别重要。我们只是认为有一个表示已写入的 `true` 值会很好，但一个空的 `bool` 或任何其他东西也可以。前面代码的主要重点是我们尝试获取文件句柄的锁。如果我们没有获得锁，我们返回 `Pending`。如果我们获得了锁，我们将条目写入文件。

当涉及到写入日志时，其他开发者构造我们的期物并生成任务到异步运行时并不直观。他们只想写入日志文件。因此，我们需要编写自己的 `write_log` 函数，该函数接受文件的句柄和要写入日志的行。在这个函数内部，我们然后生成一个 Tokio 任务并返回任务的句柄。这是一个你尝试自己编写这个函数的好机会。

如果你尝试自己编写 `write_log` 函数，它应该采用类似以下代码的方法：

```rust
fn write_log(file_handle: AsyncFileHandle, line: String) -> FileJoinHandle {
    let future = AsyncWriteFuture{
        handle: file_handle,
        entry: line
    };
    tokio::task::spawn(async move {
        future.await
    })
}
```

必须注意，即使函数定义前没有 `async`，它的行为仍然类似于异步函数。我们可以调用它并获得句柄，然后我们可以在程序稍后选择等待，像这样：

```rust
let handle = write_log(file_handle, name.to_string());
```

或者我们可以直接等待它，像这样：

```rust
let result = write_log(file_handle, name.to_string()).await;
```

现在我们可以用以下主函数运行我们的异步日志记录函数：

```rust
#[tokio::main]
async fn main() {
    let login_handle = get_handle(&"login.txt");
    let logout_handle = get_handle(&"logout.txt");

    let names = ["one", "two", "three", "four", "five", "six"];
    let mut handles = Vec::new();

    for name in names {
        let file_handle = login_handle.clone();
        let file_handle_two = logout_handle.clone();
        let handle = write_log(file_handle, name.to_string());
        let handle_two = write_log(file_handle_two, name.to_string());
        handles.push(handle);
        handles.push(handle_two);
    }
    let _ = join_all(handles).await;
}
```

如果你查看打印输出，你会看到类似于以下代码的内容。为了简洁起见，我们没有包含整个打印输出。我们可以看到六无法写入文件，因为 `try_lock()` 失败了，但五成功写入：

```
...
error for six : try_lock failed because the operation would block
written for: five
error for six : try_lock failed because the operation would block
...
```

为了确保这一切都以异步方式工作，让我们看看 `login.txt` 文件。你的文件可能有不同的顺序，但我的看起来像这样：

```
one
four
three
five
two
six
```

你可以在这里看到，在进入循环之前按顺序排列的数字已经以异步方式无序地记录下来了。

#### 确保异步操作中的顺序

这是一个需要注意的重要观察。获取锁并不是确定性的，所以我们不能假设日志写入的顺序。锁并不是造成这种无序的唯一原因。任何异步操作的响应延迟都可能导致无序的结果，因为当我们等待一个结果时，我们处理另一个结果。因此，当寻求异步解决方案时，我们不能依赖结果以特定顺序处理。

如果顺序至关重要，那么坚持使用一个期物并使用像队列这样的数据集合会减慢所有步骤的完成速度，但会确保步骤按你需要的顺序处理。在这种情况下，如果需要按顺序写入文件，我们可以将队列包装在 `Mutex` 中，并让一个期物负责在每次轮询时检查队列。另一个期物然后可以添加到该队列中。

增加可以访问队列两侧的期物数量将损害顺序的假设。虽然将访问队列两侧的期物数量限制为每个侧面一个会降低速度，但如果存在 I/O 延迟，我们仍然会受益。这是因为日志输入的等待不会阻塞我们的线程。

我们做到了！我们构建了一个异步日志记录函数，它被包装在一个单一函数中，使其易于交互。希望这个工作示例巩固了我们在本章中涵盖的概念。

### 总结

在本章中，我们踏上了 Rust 异步编程的旅程，强调了任务的关键作用。这些基于期物的异步工作单元不仅仅是技术构造；它们是实践中高效并发的基础。例如，考虑每天准备咖啡和吐司的任务。通过将其分解为异步块，我们亲眼看到代码中的多任务处理可以像我们的日常事务一样实用且节省时间。

然而，异步不是确定性的，意味着异步任务的执行顺序不是一成不变的，虽然起初可能令人望而生畏，但这为优化开辟了一个游乐场。协作式多任务处理不仅仅是一个技巧；它是一种充分利用我们资源的策略，我们已经将其应用于加速异步操作。

我们还介绍了任务之间的数据共享，这可能是一把双刃剑。很容易认为访问数据是设计解决方案的好工具，但如果没有仔细控制，正如我们使用 `Mutex` 示例所演示的那样，它可能导致不可预见的延迟和复杂性。这里有一个宝贵的教训：必须管理共享状态，不仅是为了顺序，也是为了我们代码流程的清晰性。

最后，我们对 `Future` trait 的研究不仅仅是一个学术练习；它为我们提供了一个理解和控制任务执行复杂性的视角。它提醒我们，能力伴随着责任——控制任务轮询的能力伴随着理解每个 `await` 表达式影响的责任。当我们继续前进时，请记住，实现和利用异步操作不仅仅是让任务运行起来。它还在于掌握每个异步表达式背后的动态。我们可以通过在第3章构建自己的异步队列来进一步理解这些基础动态。在那里，你将获得在 Rust 中定义和控制异步工作流所需的洞察力。

## 第三章 构建我们自己的异步队列

虽然我们已经探索了基本的异步语法，并使用高级异步概念解决了一个问题，但你可能仍然不完全清楚任务和期物究竟是什么，以及它们如何流经异步运行时。描述期物和任务可能很困难，理解它们也可能很难。本章通过指导你构建自己的异步队列（使用最少的依赖），来巩固你迄今为止所学到的关于期物、任务以及它们在异步运行时中如何运行的知识。

这个异步运行时将可通过选择队列数量和消费这些队列的工作线程数量来自定义。其实现不必统一。例如，我们可以有一个低优先级队列配备两个消费线程，一个高优先级队列配备五个消费线程。然后我们将能够选择期物将在哪个队列上被处理。我们还将实现任务窃取，即消费线程可以在自己的队列为空时从其他队列窃取任务。最后，我们将构建自己的宏，以支持高级别地使用我们的异步运行时。

到本章结束时，你将能够实现自定义的异步队列，并完全理解期物和任务如何流经异步运行时。你还将掌握定制异步运行时以解决特定问题的技能，这些问题可能标准的、开箱即用的运行时环境无法处理。即使你永远不想再次实现自己的异步队列，你也将对异步运行时有更深的理解，从而能更有效地操纵高级异步 crate 来解决你的问题。你还会理解异步代码的权衡，即使是在高级别实现异步代码时。

我们通过定义如何生成任务来开始探索构建异步队列，因为任务生成是进入运行时的入口点。这个异步运行时将是可配置的，允许你选择拥有多少个队列以及有多少个消费线程将处理这些队列。

### 构建我们自己的异步队列

在本节中，我们将逐步介绍构建自定义异步队列的过程。如果我们将实现分解为步骤，我们将亲眼看到我们的期物如何转换为任务并被执行。

在这个例子中，我们正在构建一个简单的异步队列，我们将处理三个任务。我们将在定义每个任务时对其进行描述。

在编写任何代码之前，我们需要以下依赖：

```toml
[dependencies]
async-task = "4.4.0"
futures-lite = "1.12.0"
flume = "0.10.14"
```

我们使用这些依赖的原因如下：

**async-task**  
这个 crate 对于在异步运行时内生成和管理任务至关重要。它提供了将期物转换为任务所需的核心功能。

**futures-lite**  
期物的轻量级实现。

**flume**  
一个多生产者、多消费者的通道，我们将用它来实现我们的异步队列，允许任务在运行时内安全地传递。我们可以在这里使用 `async-channel`，但我们选择 `flume`，是因为我们希望能够克隆接收器，因为我们将在消费者之间分发任务。此外，`flume` 提供了可以容纳无限数量消息的无界通道，并实现了无锁算法。这使得 `flume` 特别适用于高并发程序，这些程序的队列可能需要并行处理大量消息，这与依赖于阻塞互斥锁进行同步的标准库通道不同。

接下来，我们需要将以下内容导入到我们的 `main.rs` 文件中：

```rust
use std::{future::Future, panic::catch_unwind, thread};
use std::pin::Pin;
use std::task::{Context, Poll};
use std::time::Duration;
use std::sync::LazyLock;

use async_task::{Runnable, Task};
use futures_lite::future;
```

我们将在本章中使用这些导入项时介绍它们，以便你理解其上下文。

我们的三个任务中的每一个都需要能够被传入队列。我们应该从构建任务生成函数开始。这是我们向函数传入期物的地方。然后该函数将期物转换为任务，并将任务放入队列中以备执行。在这一点上，这可能看起来像一个复杂的函数，所以让我们从这个签名开始：

```rust
fn spawn_task<F, T>(future: F) -> Task<T>
where
    F: Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    . . .
}
```

这是一个泛型函数，它接受任何同时实现了 `Future` 和 `Send` trait 的类型。这是合理的，因为我们不希望被限制为只能通过函数发送一种类型的期物。`Future` trait 表示我们的期物将产生一个错误或值 `T`。我们的期物需要 `Send` trait，因为我们将把期物发送到基于不同线程的队列中。`Send` trait 强制了确保我们的期物可以安全地在线程间共享的约束。

`'static` 意味着我们的期物不包含任何生命周期短于 `'static` 生命周期的引用。因此，期物可以在程序运行的整个期间使用。确保这个生命周期是必要的，因为我们不能强制程序员等待任务完成。如果开发者从不等待任务，任务可能会在程序的整个生命周期内运行。由于我们无法保证任务何时完成，我们必须确保任务的寿命是静态的。在浏览异步代码时，你可能见过使用 `async move`。这是将异步闭包中使用的变量的所有权移动到任务中，以便我们可以确保其寿命是静态的。

现在我们已经定义了 `spawn_task` 函数的签名，接下来我们来看函数中的第一段代码，它定义了任务队列：

```rust
static QUEUE: LazyLock<flume::Sender<Runnable>> = LazyLock::new(|| {
    . . .
});
```

使用 `static` 是为了确保我们的队列在整个程序的生命周期内存在。这是合理的，因为我们希望在程序的整个生命周期内向队列发送任务。`LazyLock` 结构体在首次访问时初始化。一旦结构体初始化，它就不会再次初始化。这是因为每次我们向异步运行时发送期物时都会调用任务生成函数。如果我们每次调用 `spawn_task` 时都初始化队列，就会清除队列中之前的任务。现在我们有了一个通道的发送端，它发送 `Runnable`。

`Runnable` 是一个可运行任务的句柄。每个生成的任务都有一个单一的 `Runnable` 句柄，该句柄仅在任务被调度运行时存在。该句柄具有 `run` 函数，该函数对任务的期物进行一次轮询。然后 `runnable` 被丢弃。只有当唤醒器唤醒任务时，可运行对象才会再次出现，从而再次调度任务。回想第2章，如果我们不将唤醒器传入期物，期物将不会被再次轮询。这是因为期物无法被唤醒以进行再次轮询。我们可以构建一个异步运行时，无论唤醒器是否存在都会轮询期物，我们将在第10章探讨这一点。

现在我们已经定义了队列的签名，我们可以看看传递给 `LazyLock` 的闭包。我们需要创建我们的通道以及接收发送到该通道的期物的机制：

```rust
let (tx, rx) = flume::unbounded::<Runnable>();

thread::spawn(move || {
    while let Ok(runnable) = rx.recv() {
        println!("runnable accepted");
        let _ = catch_unwind(|| runnable.run());
    }
});
tx
```

创建通道后，我们生成一个等待传入流量的线程。等待传入流量是阻塞的，因为我们正在构建异步队列来处理传入的异步任务。因此，我们不能在线程中依赖异步。一旦我们接收到 `runnable`，我们就在 `catch_unwind` 函数中运行它。我们使用这个函数是因为我们不知道传递给异步运行时的代码质量。理想情况下，所有 Rust 开发者都会正确处理可能的错误，但以防万一，`catch_unwind` 会运行代码并捕获代码运行时抛出的任何错误，根据结果返回 `Ok` 或 `Err`。这是为了防止编码错误的期物炸毁我们的异步运行时。然后我们返回发送器通道，以便我们可以向线程发送可运行对象。

现在我们有了一个正在运行的线程，等待任务发送到该线程进行处理，我们通过以下代码实现：

```rust
let schedule = |runnable| QUEUE.send(runnable).unwrap();
let (runnable, task) = async_task::spawn(future, schedule);
```

在这里，我们创建了一个闭包，它接受一个可运行对象并将其发送到我们的队列。然后我们使用 `async_task` 的 `spawn` 函数创建可运行对象和任务。这个函数会调用一个不安全函数，将期物分配到堆上。从 `spawn` 函数返回的任务和可运行对象都有一个指向同一个期物的指针。

在本章中，我们将不会构建自己的执行器或创建可运行对象或调度任务的代码。我们将在第10章构建一个完全来自标准库、没有外部依赖的异步服务器时完成这些工作。

现在可运行对象和任务都有了指向同一个期物的指针，我们必须调度可运行对象运行并返回任务：

```rust
runnable.schedule();
println!("Here is the queue count: {:?}", QUEUE.len());
return task
```

当我们调度可运行对象时，实质上是将任务放入队列进行处理。如果我们不调度可运行对象，任务就不会运行，并且当我们尝试阻塞主线程以等待任务执行时（因为队列上没有可运行对象，但我们仍然返回了任务），我们的程序就会崩溃。记住，任务和可运行对象都有指向同一个期物的指针。

现在我们已经调度了可运行对象在队列上运行并返回了任务，我们基础的异步运行时就完成了。我们需要做的就是构建一些基础的期物。我们将有两种类型的任务。

第一种任务类型是我们的 `CounterFuture`，我们最初在第2章探讨过。这个期物会增加计数器并在每次轮询后打印结果，通过调用 `std::thread::sleep` 来模拟延迟。代码如下：

```rust
struct CounterFuture {
    count: u32,
}
impl Future for CounterFuture {
    type Output = u32;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        self.count += 1;
        println!("polling with result: {}", self.count);
        std::thread::sleep(Duration::from_secs(1));
        if self.count < 3 {
            cx.waker().wake_by_ref();
            Poll::Pending
        } else {
            Poll::Ready(self.count)
        }
    }
}
```

第二种任务（任务3）是使用 `async/await` 语法创建的异步函数。该函数在打印消息前睡眠1秒。代码如下：

```rust
async fn async_fn() {
    std::thread::sleep(Duration::from_secs(1));
    println!("async fn");
}
```

在这个例子中，我们没有像 `CounterFuture` 那样手动编写自己的轮询机制。相反，我们使用 Rust 异步语法提供的内置异步功能，它自动为我们处理任务的轮询和调度。注意，`async_fn` 中的睡眠是阻塞的，因为我们想看看任务在队列中是如何被处理的。

在我们继续之前，我们可以绕个弯，了解一下非阻塞的异步睡眠函数是如何工作的。在本章中，我们使用的是阻塞执行器的睡眠函数。我们这样做是为了教学目的，以便我们可以轻松地映射任务在运行时中是如何被处理的。然而，如果我们想要构建一个高效的异步睡眠函数，我们需要倾向于让执行器轮询我们的睡眠期物，并在时间未到时返回 `Pending`。首先我们需要 `Instant` 来计算经过的时间，以及两个字段来跟踪睡眠：

```rust
use std::time::Instant;

struct AsyncSleep {
    start_time: Instant,
    duration: Duration,
}
impl AsyncSleep {
    fn new(duration: Duration) -> Self {
        Self {
            start_time: Instant::now(),
            duration,
        }
    }
}
```

然后我们可以在每次轮询时检查当前时间与 `start_time` 之间经过的时间，如果经过的时间不足，则返回 `Pending`：

```rust
impl Future for AsyncSleep {
    type Output = bool;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        let elapsed_time = self.start_time.elapsed();
        if elapsed_time >= self.duration {
            Poll::Ready(true)
        } else {
            cx.waker().wake_by_ref();
            Poll::Pending
        }
    }
}
```

这不会用空闲的睡眠时间阻塞执行器。因为睡眠只是进程的一部分，我们可以在异步块中调用这个睡眠期物的 `await`，如下所示：

```rust
let async_sleep = AsyncSleep::new(Duration::from_secs(5));
let async_sleep_handle = spawn_task(async {
    async_sleep.await;
    . . .
});
```

与编程中的大多数事情一样，总是存在权衡。如果有很多任务排在睡眠任务前面，那么异步睡眠任务可能在实际完成前等待的时间超过所需持续时间的可能性会增加，因为它可能必须在每次轮询之间等待其他任务完成。如果你有一个操作需要在两个步骤之间等待 x 秒，阻塞睡眠可能是更好的选择，但如果你有很多这样的任务，你会很快阻塞你的队列。

回到我们的阻塞例子，我们现在可以使用以下主函数在运行时中运行一些期物：

```rust
fn main() {
    let one = CounterFuture { count: 0 };
    let two = CounterFuture { count: 0 };
    let t_one = spawn_task(one);
    let t_two = spawn_task(two);
    let t_three = spawn_task(async {
        async_fn().await;
        async_fn().await;
        async_fn().await;
        async_fn().await;
    });
    std::thread::sleep(Duration::from_secs(5));
    println!("before the block");
    future::block_on(t_one);
    future::block_on(t_two);
    future::block_on(t_three);
}
```

这个主函数有一些重复，但这是必要的，以便我们能了解刚刚构建的异步运行时如何处理期物。注意，任务3包含对 `async_fn` 的多次调用。这有助于我们看到运行时如何处理单个任务内的多个异步操作。然后我们等待5秒并打印，以便在执行 `block_on` 函数之前了解系统是如何运行的。

运行我们的程序会得到以下冗长但必要的终端输出：

```
Here is the queue count: 1
Here is the queue count: 2
Here is the queue count: 3
runnable accepted
polling with result: 1
runnable accepted
polling with result: 1
runnable accepted
async fn
async fn
before the block
async fn
async fn
runnable accepted
polling with result: 2
runnable accepted
polling with result: 2
runnable accepted
polling with result: 3
runnable accepted
polling with result: 3
```

我们的输出给出了异步运行时的时间线。我们可以看到，队列中填入了我们生成的三个任务，并且在调用 `block_on` 函数之前，我们的运行时正在异步地按顺序处理它们。即使在第一个 `block_on` 函数被调用后（该函数阻塞在我们生成的第一个任务上），两个计数器任务也在同时被处理。

注意，我们构建并在第三个任务中调用四次的异步函数本质上是阻塞的。即使在异步函数内部，我们使用了 `await` 语法，像这样：

```rust
async {
    async_fn().await;
    async_fn().await;
    async_fn().await;
    async_fn().await;
}
```

`async_fn` 期物的堆栈会阻塞正在处理任务队列的线程，直到整个任务完成。当轮询结果为 `Pending` 时，任务会被放回队列，以便再次轮询。

我们的异步运行时可以用图3-1中的图表来总结。

**图3-1. 我们的异步运行时**

让我们用一个类比来描述正在发生的事情。假设我们有一件需要清洗的脏外套。外套内侧的标签指示了清洗说明和材料成分，这就像是期物。我们走进干洗店，把外套和说明一起交给工作人员。干洗店的工作人员给外套套上一个塑料罩并给它一个号码，使其成为可运行的。工作人员还给你一张带有号码的票据，这就像是主函数得到的任务。

然后我们继续做我们一天中的事情，同时外套正在被清洗。如果外套第一次没有被清洗干净，它会继续经过清洗循环，直到干净为止。然后我们带着票据回来，把它交给工作人员。这与 `block_on` 函数阶段相同。如果我们回来之前花了很长时间，外套可能已经干净了，我们可以直接拿走它继续我们的一天。如果我们去干洗店太早，外套还没洗好，我们就得等到外套洗干净才能拿回家。干净的外套就是结果。

目前，我们的异步运行时只有一个线程在处理队列。这就像我们坚持干洗店只有一个工作人员一样。这不是对可用资源的最有效利用，因为大多数 CPU 都有多个核心。考虑到这一点，探索如何增加工作者和队列的数量以提高我们处理更多任务的能力将是有用的。

### 增加工作者和队列

为了增加处理队列的线程数量，我们可以克隆队列通道的接收器，添加另一个线程从队列消费：

```rust
let (tx, rx) = flume::unbounded::<Runnable>();

let queue_one = rx.clone();
let queue_two = rx.clone();

thread::spawn(move || {
    while let Ok(runnable) = queue_one.recv() {
        let _ = catch_unwind(|| runnable.run());
    }
});
thread::spawn(move || {
    while let Ok(runnable) = queue_two.recv() {
        let _ = catch_unwind(|| runnable.run());
    }
});
```

如果我们通过通道发送任务，流量通常会分布在两个线程上。如果一个线程被 CPU 密集型任务阻塞，另一个线程将继续处理任务。回想一下，第1章用我们的斐波那契数例子证明了 CPU 密集型任务可以通过使用线程并行运行。我们可以使用以下代码以更符合人体工程学的方式构建线程池：

```rust
for _ in 0..3 {
    let receiver = rx.clone();
    thread::spawn(move || {
        while let Ok(runnable) = receiver.recv() {
            let _ = catch_unwind(|| runnable.run());
        }
    });
}
```

我们可以将 CPU 密集型任务卸载到我们的线程池，并继续处理程序的其余部分，当我们需要任务的结果时再阻塞它。虽然这并不完全是异步编程的精神（因为我们使用异步编程来优化 I/O 操作的调度），但记住某些问题可以通过在程序早期卸载 CPU 密集型任务来解决，这是一个有用的方法。

你可能遇到过类似“异步不适用于计算繁重的任务”的警告。异步只是一种机制，只要你认为合理，就可以用它来做你想做的事情。然而，这个警告并非没有道理。例如，如果你像大多数 Web 框架那样使用异步运行时来处理传入请求，那么将计算繁重的任务扔到异步运行时队列中，可能会在你完成这些计算之前阻塞你处理传入请求的能力。

现在我们已经探索了多个工作者，我们确实应该看看多个队列。

### 将任务传递给不同的队列

我们可能想要拥有多个队列的原因之一是我们可能对任务有不同的优先级。在本节中，我们将构建一个有两个消费线程的高优先级队列和一个有一个消费线程的低优先级队列。为了支持多个队列，我们需要以下枚举来对任务的目标队列类型进行分类：

```rust
#[derive(Debug, Clone, Copy)]
enum FutureType {
    High,
    Low
}
```

我们还需要我们的期物在传入生成函数时通过利用 trait 来产生未来类型：

```rust
trait FutureOrderLabel: Future {
    fn get_order(&self) -> FutureType;
}
```

然后我们需要通过添加一个额外的字段来添加未来类型：

```rust
struct CounterFuture {
    count: u32,
    order: FutureType
}
```

我们的 `poll` 函数保持不变，所以我们不需要重新讨论它。然而，我们需要为我们的期物实现 `FutureOrderLabel` trait：

```rust
impl FutureOrderLabel for CounterFuture {
    fn get_order(&self) -> FutureType {
        self.order
    }
}
```

现在我们的期物已准备好被处理，我们需要重新格式化异步运行时以使用未来类型。我们的 `spawn_task` 函数的签名保持不变，除了额外的 trait：

```rust
fn spawn_task<F, T>(future: F) -> Task<T>
where
    F: Future<Output = T> + Send + 'static + FutureOrderLabel,
    T: Send + 'static,
{
    . . .
}
```

现在我们可以定义我们的两个队列。在这一点上，你可以尝试自己编写代码，然后再继续，因为我们已经涵盖了构建两个队列所需的一切。如果你尝试构建队列，希望它们的形式类似于以下内容：

```rust
static HIGH_QUEUE: LazyLock<flume::Sender<Runnable>> = LazyLock::new(|| {
    let (tx, rx) = flume::unbounded::<Runnable>();
    for _ in 0..2 {
        let receiver = rx.clone();
        thread::spawn(move || {
            while let Ok(runnable) = receiver.recv() {
                let _ = catch_unwind(|| runnable.run());
            }
        });
    }
    tx
});

static LOW_QUEUE: LazyLock<flume::Sender<Runnable>> = LazyLock::new(|| {
    let (tx, rx) = flume::unbounded::<Runnable>();
    for _ in 0..1 {
        let receiver = rx.clone();
        thread::spawn(move || {
            while let Ok(runnable) = receiver.recv() {
                let _ = catch_unwind(|| runnable.run());
            }
        });
    }
    tx
});
```

低优先级队列有一个消费线程，高优先级队列有两个消费线程。现在我们需要将期物路由到正确的队列。这可以通过为每个队列定义一个单独的运行器闭包，然后根据期物类型传递正确的闭包来实现：

```rust
let schedule_high = |runnable| HIGH_QUEUE.send(runnable).unwrap();
let schedule_low = |runnable| LOW_QUEUE.send(runnable).unwrap();

let schedule = match future.get_order() {
    FutureType::High => schedule_high,
    FutureType::Low => schedule_low
};

let (runnable, task) = async_task::spawn(future, schedule);
runnable.schedule();
return task
```

现在我们可以创建一个期物，并将其插入到选定的队列中：

```rust
let one = CounterFuture { count: 0 , order: FutureType::High};
```

然而，我们有一个问题。想象一下，创建了大量的低优先级任务，而没有高优先级任务。我们将有一个消费线程处理所有任务，而另外两个消费线程只是空闲地坐着。我们将以三分之一的能力工作。这就是任务窃取发挥作用的地方。

我们不需要编写自己的异步运行时队列来控制任务的分布。例如，Tokio 将允许你通过使用 `Local Set` 来控制任务的分布。我们将在第7章介绍这个。

### 任务窃取

在任务窃取中，当消费线程自己的队列为空时，它们会从其他队列窃取任务。图3-2显示了任务窃取与我们当前异步系统的关系。

**图3-2. 任务窃取**

我们还必须认识到窃取可以反向进行。如果低优先级队列为空，我们会希望低优先级消费线程从高优先级队列窃取任务。

为了实现任务窃取，我们需要将高优先级和低优先级队列的通道传递到两个队列中。在定义通道之前，我们需要这个导入：

```rust
use flume::{Sender, Receiver};
```

如果我们使用标准库作为 `Sender` 和 `Receiver`，我们将无法将 `Sender` 或 `Receiver` 发送到其他线程。使用 `flume`，我们将两个通道都设为静态的，并在 `spawn_task` 函数内进行惰性求值：

```rust
static HIGH_CHANNEL: LazyLock<(Sender<Runnable>, Receiver<Runnable>)> =
    LazyLock::new(|| flume::unbounded::<Runnable>());
static LOW_CHANNEL: LazyLock<(Sender<Runnable>, Receiver<Runnable>)> =
    LazyLock::new(|| flume::unbounded::<Runnable>());
```

现在我们有了两个通道，我们需要定义高优先级队列消费线程，在无限循环的每次迭代中执行以下步骤：

1.  检查 `HIGH_CHANNEL` 是否有消息。
2.  如果 `HIGH_CHANNEL` 没有消息，则检查 `LOW_CHANNEL` 是否有消息。
3.  如果 `LOW_CHANNEL` 没有消息，则等待100毫秒进行下一次迭代。

如果线程空闲，我们可以停放它们，并在需要处理传入任务时唤醒它们。当没有任务要处理时，这可以节省过多的循环和睡眠。然而，依赖线程中的睡眠会增加响应延迟，这在生产代码中是不可取的。在生产环境中，你应该尽量避免在线程中睡眠，而是使用更响应的机制，如线程停放或条件变量。我们在第10章讨论与异步队列相关的线程停放。

我们的高优先级队列可以使用以下代码执行这些步骤：

```rust
static HIGH_QUEUE: LazyLock<flume::Sender<Runnable>> = LazyLock::new(|| {
    for _ in 0..2 {
        let high_receiver = HIGH_CHANNEL.1.clone();
        let low_receiver = LOW_CHANNEL.1.clone();
        thread::spawn(move || {
            loop {
                match high_receiver.try_recv() {
                    Ok(runnable) => {
                        let _ = catch_unwind(|| runnable.run());
                    },
                    Err(_) => {
                        match low_receiver.try_recv() {
                            Ok(runnable) => {
                                let _ = catch_unwind(|| runnable.run());
                            },
                            Err(_) => {
                                thread::sleep(Duration::from_millis(100));
                            }
                        }
                    }
                }
            }
        });
    }
    HIGH_CHANNEL.0.clone()
});
```

我们的低优先级队列只需将步骤1和2交换，并返回 `LOW_CHANNEL.0.clone`。现在我们两个队列都先从自己的队列拉取任务，当自己的队列没有任务时再从其他队列拉取任务。当没有任务剩余时，我们就让消费线程减速。

记住，队列和通道在求值时是惰性的。需要向队列发送任务，队列才会开始运行。如果你只向低优先级队列发送任务，而从不向高优先级队列发送，高优先级队列将永远不会启动，因此也永远不会从低优先级队列窃取任务。

在这个里程碑，我们可以坐下来想一想我们做了什么。我们创建了自己的异步运行时队列，并定义了不同的队列！现在我们可以精细控制异步任务的运行方式。注意，我们可能不想要任务窃取。例如，如果我们将 CPU 密集型任务放在高优先级队列，将轻量级网络任务放在低优先级队列，我们就不希望低优先级队列从高优先级队列窃取任务。否则，我们就有因低优先级队列消费线程被 CPU 密集型任务占用而关闭网络处理的风险。

虽然使用 trait 约束并将其实现到期物上很有趣，但我们现在处于劣势。我们不能传入简单的异步块或异步函数，因为它们没有实现 `FutureOrderLabel` trait。其他开发者只想要一个友好的接口来运行他们的任务。你能想象如果我们必须为每个异步任务实现 `Future` trait 并在所有这些任务上实现 `FutureOrderLabel`，我们的代码会有多臃肿吗？我们需要重构 `spawn_task` 函数以获得更好的开发者体验。

### 重构我们的 spawn_task 函数

当涉及到允许异步块和异步函数进入 `spawn_task` 函数时，我们需要移除 `FutureOrderLabel` trait，并从 `CounterFuture` 结构体中移除 `order` 字段。然后我们必须移除 `spawn_task` 函数中 `FutureOrderLabel` trait 的约束，并为顺序添加另一个参数，给出以下函数签名：

```rust
fn spawn_task<F, T>(future: F, order: FutureType) -> Task<T>
where
    F: Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    . . .
}
```

我们还需要更新 `spawn_task` 函数中选择正确调度闭包的逻辑：

```rust
let schedule = match order {
    FutureType::High => schedule_high,
    FutureType::Low => schedule_low
};
```

尽管如此，我们仍然不希望我们的开发人员为顺序而烦恼，所以我们可以为 `spawn_task` 函数创建一个宏：

```rust
macro_rules! spawn_task {
    ($future:expr) => {
        spawn_task!($future, FutureType::Low)
    };
    ($future:expr, $order:expr) => {
        spawn_task($future, $order)
    };
}
```

这个宏允许我们只传入期物。如果我们只传入期物，那么我们传入低优先级类型，这意味着这是默认类型。如果传入了顺序，则将其传入 `spawn_task` 函数。从这个宏中，Rust 推断出你至少需要提供期物表达式，如果不提供期物，它将无法编译。现在我们有了一个更符合人体工程学的方式来生成任务，正如你在以下示例中看到的：

```rust
fn main() {
    let one = CounterFuture { count: 0 };
    let two = CounterFuture { count: 0 };

    let t_one = spawn_task!(one, FutureType::High);
    let t_two = spawn_task!(two);
    let t_three = spawn_task!(async_fn());
    let t_four = spawn_task!(async {
        async_fn().await;
        async_fn().await;
    }, FutureType::High);

    future::block_on(t_one);
    future::block_on(t_two);
    future::block_on(t_three);
    future::block_on(t_four);
}
```

这个宏很灵活。使用它的开发者可以随意生成任务而无需过多思考，但也可以在需要时声明任务为高优先级。我们还可以传入异步块和异步函数，因为这些只是期物的语法糖。然而，当阻塞主函数以等待多个任务时，我们正在重复自己。我们需要创建自己的 `join` 宏来防止这种重复。

### 创建我们自己的 Join 宏

要创建我们自己的 `join` 宏，我们需要接受一系列任务并调用 `block_on` 函数。我们可以用以下代码定义自己的 `join` 宏：

```rust
macro_rules! join {
    ($($future:expr),*) => {
        {
            let mut results = Vec::new();
            $(
                results.push(future::block_on($future));
            )*
            results
        }
    };
}
```

保持结果的顺序与传入期物的顺序相同是至关重要的。否则，用户将无法知道哪个结果属于哪个任务。还要注意，我们的 `join` 宏将只返回一种类型，所以我们像下面这样使用我们的 `join` 宏：

```rust
let outcome: Vec<u32> = join!(t_one, t_two);
let outcome_two: Vec<()> = join!(t_four, t_three);
```

`outcome` 是计数器输出的向量，`outcome_two` 是没有返回任何内容的异步函数输出的向量。只要我们有相同的返回类型，这段代码就能工作。

我们必须记住，我们的任务是直接运行的。任务的执行过程中可能会发生错误。为了返回一个结果向量，我们可以创建一个 `try_join` 宏，代码如下：

```rust
macro_rules! try_join {
    ($($future:expr),*) => {
        {
            let mut results = Vec::new();
            $(
                let result = catch_unwind(|| future::block_on($future));
                results.push(result);
            )*
            results
        }
    };
}
```

这与我们的 `join!` 宏类似，但会返回任务的结果。

现在我们几乎拥有了以符合人体工程学的方式在运行时上运行异步任务所需的一切，包括任务窃取和不同的队列。尽管生成任务还不完全符合人体工程学，但我们仍然需要一个友好的接口来配置运行时环境。

### 配置我们的运行时

你可能还记得队列是惰性的：只有在被调用时才会启动。这直接影响我们的任务窃取。我们给出的例子是，如果没有任务被发送到高优先级队列，该队列将不会启动，因此如果低优先级队列为空，它将不会从低优先级队列窃取任务，反之亦然。配置运行时以启动并优化消费循环的数量并不是解决这个问题的异常方法。例如，我们可以看看以下启动其运行时的 *Tokio* 示例：

```rust
use tokio::runtime::Runtime;

// 创建运行时
let rt = Runtime::new().unwrap();

// 在运行时上生成一个期物
rt.spawn(async {
    println!("now running on a worker thread");
});
```

在撰写本文时，前面的例子在运行时结构体的 *Tokio* 文档中。*Tokio* 库也使用过程宏来设置运行时，但这超出了本书的范围。你可以在 Rust 文档中找到更多关于过程宏的信息。对于我们的运行时，我们可以构建一个基本的运行时构建器来定义高优先级和低优先级队列上的消费循环数量。

我们首先从运行时结构体开始：

```rust
struct Runtime {
    high_num: usize,
    low_num: usize,
}
```

高数字是高优先级队列的消费线程数，低数字是低优先级队列的消费线程数。我们为运行时实现以下函数：

```rust
impl Runtime {
    pub fn new() -> Self {
        let num_cores = std::thread::available_parallelism().unwrap()
            .get();
        Self {
            high_num: num_cores - 2,
            low_num: 1,
        }
    }
    pub fn with_high_num(mut self, num: usize) -> Self {
        self.high_num = num;
        self
    }
    pub fn with_low_num(mut self, num: usize) -> Self {
        self.low_num = num;
        self
    }
    pub fn run(&self) {
        ...
    }
}
```

这里我们有一种基于运行异步程序的计算机可用核心数量来定义数字的标准方法。然后，如果我们愿意，我们可以自己定义低和高数字。我们的 `run` 函数定义环境变量中的数字，然后向两个队列各生成一个任务来设置队列：

```rust
pub fn run(&self) {
    std::env::set_var("HIGH_NUM", self.high_num.to_string());
    std::env::set_var("LOW_NUM", self.low_num.to_string());
    let high = spawn_task!(async {}, FutureType::High);
    let low = spawn_task!(async {}, FutureType::Low);
    join!(high, low);
}
```

我们使用 `join`，这样在 `run` 函数执行完毕后，我们的两个队列都已准备好窃取任务。

在尝试我们的运行时之前，我们需要使用这些环境变量来确定每个队列的消费线程数量。在 `spawn_task` 函数中，我们在每个队列定义中引用环境变量：

```rust
static HIGH_QUEUE: LazyLock<flume::Sender<Runnable>> = LazyLock::new(|| {
    let high_num = std::env::var("HIGH_NUM").unwrap().parse::<usize>();
    for _ in 0..high_num {
        ...
    }
});
```

低优先级队列也是如此。然后我们可以在 `main` 函数中、其他任何操作之前，用默认数字定义运行时：

```rust
Runtime::new().run();
```

或者我们可以使用自定义数字：

```rust
Runtime::new().with_low_num(2).with_high_num(4).run();
```

现在，我们能够在程序的其余部分随时运行 `spawn_task` 函数和 `join` 宏。我们拥有了自己的可配置运行时，它包含两种类型的队列和任务窃取功能！

现在我们几乎把所有东西都整合好了。然而，在结束本章之前，我们需要介绍最后一个概念：后台进程。

### 运行后台进程

后台进程是在程序的整个生命周期内定期在后台执行的任务。这些进程可用于监控和维护任务，例如数据库清理、日志轮转和数据更新，以确保程序始终能够访问最新信息。在异步运行时中将一个基本的后台进程作为任务来实现，将说明如何处理我们的长时间运行任务。

在处理后台任务之前，我们需要创建一个永远不会停止被轮询的期物。在本章的这个阶段，你应该能够自己构建这个，你应该在继续之前尝试这样做。

如果你尝试构建自己的期物，如果正在执行的过程是阻塞的，它应该采取以下形式：

```rust
#[derive(Debug, Clone, Copy)]
struct BackgroundProcess;

impl Future for BackgroundProcess {
    type Output = ();

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        println!("background process firing");
        std::thread::sleep(Duration::from_secs(1));
        cx.waker().wake_by_ref();
        Poll::Pending
    }
}
```

你的实现可能不同，但关键的一点是我们总是返回 `Pending`。

我们需要承认，如果我们在主函数中丢弃一个任务，异步运行时中正在执行的任务将被取消，不会被执行，所以我们的后台任务必须在程序的整个生命周期内都存在。我们需要在 `main` 函数的最开始，就在定义运行时之后发送后台任务：

```rust
Runtime::new().with_low_num(2).with_high_num(4).run();
let _background = spawn_task!(BackgroundProcess{});
```

然后我们的后台进程将在整个程序的生命周期内定期运行。

然而，这并不符合人体工程学。例如，假设一个结构体或函数可以创建一个后台运行的任务。我们不需要在程序中到处处理任务以防止它被丢弃从而取消后台任务。我们可以通过使用 `detach` 方法来消除这种到处处理任务以保持后台任务运行的需要：

```rust
Runtime::new().with_low_num(2).with_high_num(4).run();
spawn_task!(BackgroundProcess()).detach();
```

这个方法将任务中的指针移动到一个不安全的循环中，该循环将轮询任务并调度它直到完成。然后与主函数中任务关联的指针被丢弃，从而消除了在主函数中保持任务的需要。

### 总结

在本章中，我们实现了自己的运行时，在这个过程中你学到了很多。我们最初构建了一个基本的异步运行时环境，它接受期物并创建任务和可运行对象。可运行对象被放入队列，由消费线程处理，任务返回给主函数，我们可以阻塞主函数以等待任务的结果。在这里，我们花了一些时间来巩固期物和任务在异步运行时中经历的步骤。最后，我们实现了具有不同数量消费线程的队列，并使用这种模式来实现任务窃取，以应对队列为空的情况。然后，我们为用户创建了自己的宏，使他们可以轻松地生成任务并合并它们。

任务窃取带来的细微差别突出了异步编程的真正本质。异步运行时仅仅是你用来解决问题的工具。如果你有一个程序流量不大，但这些流量请求触发长时间运行的任务，那么阻止你有一个队列接收网络流量，五个线程处理长时间 CPU 密集型任务？在这种情况下，你不希望你的网络队列从 CPU 密集型队列窃取。当然，你的解决方案应该力求合理。然而，随着对你所使用的异步运行时的理解加深，你就有能力以有趣的方式解决复杂问题。

我们构建的异步运行时当然不是最好的。成熟的异步运行时有非常聪明的人员团队来解决各种问题和边缘情况。然而，既然你已经读完本章，你应该理解需要围绕你所选运行时的具体细节进行阅读，以便将其特性应用于你试图解决的具体问题。还要注意，使用 `flume` 通道的 `async_task` 队列的简单实现可以在生产中使用。

在第4章中，我们介绍如何将 HTTP 集成到我们自己的异步运行时中。

## 第四章 将网络功能集成到我们自己的异步运行时

在第3章中，我们构建了自己的异步运行时队列，以说明异步任务如何通过异步运行时运行。然而，我们只使用了基本的睡眠和打印操作。专注于简单操作在初期是有用的，但简单的睡眠和打印函数是有局限性的。在本章中，我们将在之前定义的异步运行时基础上进行构建，并集成网络协议，以便它们可以在我们的异步运行时上运行。

到本章结束时，你将能够使用 trait 将用于 HTTP 请求的 *hyper* crate 集成到我们的运行时中。这意味着你将能够在本例的基础上，在阅读了其他第三方依赖项的文档后，通过 trait 将其集成到我们的异步运行时中。最后，我们将深入到更底层，通过实现 *mio* crate 来在期物中直接轮询套接字。这将向你展示如何在我们的异步运行时中，对套接字的轮询、读取和写入方式实现细粒度控制。有了这些经验以及进一步的外部阅读，你将能够实现自己的自定义网络协议。

这是最难理解的一章，如果你不计划将网络功能集成到自定义运行时中，它并不是必需的。如果你觉得有困难，可以随时跳过本章，在阅读完本书其余部分后再回来。本章之所以安排这些内容，是因为它建立在第3章编写的代码之上。

在我们开始本章之前，除了第3章使用的依赖项外，我们还需要以下额外的依赖项：

```toml
[dependencies]
hyper = { version = "0.14.26",
          features = ["http1", "http2", "client", "runtime"] }
smol = "1.3.0"
anyhow = "1.0.70"
async-native-tls = "0.5.0"
http = "0.2.9"
tokio = "1.14.0"
```

我们使用这些依赖项的原因如下：

**hyper**  
这是一个快速且流行的 HTTP 实现。我们将使用它来发出请求。我们需要 `client` 功能来允许我们发出 HTTP 请求，`runtime` 功能来允许与自定义异步运行时兼容。

**smol**  
这是一个小型且快速的异步运行时。它特别适用于开销小的轻量级任务。

**anyhow**  
这是一个错误处理库。

**async-native-tls**  
该 crate 提供异步传输层安全性（TLS）支持。

**http**  
该 crate 提供了用于处理 HTTP 请求及其响应的类型。

**Tokio**  
我们之前在演示异步运行时使用过这个 crate，本章将再次使用它。

如你所见，我们将在这个例子中使用 *hyper*。这是为了给你提供一组与之前例子不同的工具，并演示像 Tokio 这样的工具是如何分层应用于其他常用库中的。然而，在我们编写任何代码之前，必须介绍执行器和连接器。

### 理解执行器和连接器

执行器负责将期物运行至完成。它是运行时的一部分，负责调度任务并确保它们在就绪时运行（或被执行）。当我们在运行时中引入网络功能时，我们需要一个执行器，因为没有它，像 HTTP 请求这样的期物将被创建但永远不会实际运行。

在网络中，连接器是建立应用程序与我们想要连接的服务之间连接的组件。它处理诸如打开 TCP 连接以及在请求的生命周期内维护连接等活动。

### 将 hyper 集成到我们的异步运行时

现在你理解了执行器和连接器是什么，让我们看看这些概念在将像 *hyper* 这样的库集成到我们的异步运行时中是多么重要。没有适当的执行器和连接器，我们的运行时将无法处理 *hyper* 所依赖的 HTTP 请求和连接。

如果我们查看 *hyper* 官方文档或各种在线教程，我们可能会得到这样的印象：可以使用 *hyper* crate 通过以下代码执行简单的 GET 请求：

```rust
use hyper::{Request, Client};

let url = "http://www.rust-lang.org";
let url: Url = url.parse().unwrap();

let request = Request::builder()
    .method("GET")
    .uri(url)
    .header("User-Agent", "hyper/0.14.2")
    .header("Accept", "text/html")
    .body(hyper::Body::empty()).unwrap();

let future = async {
    let client = Client::new();
    client.request(request).await.unwrap()
};
let test = spawn_task!(future);
let response = future::block_on(test);
println!("Response status: {}", response.status());
}
```

然而，如果我们运行教程代码，会得到以下错误：

```
thread '<unnamed>' panicked at 'there is no reactor
running, must be called from the context of a Tokio 1.x runtime
```

这是因为在底层，*hyper* 默认在 *Tokio* 运行时上运行，而我们的代码中没有指定执行器。如果你要使用 *request* 或其他流行的 crate，很可能也会遇到类似的错误。

为了解决这个问题，我们将创建一个自定义执行器，它可以在我们构建的自定义异步运行时中处理我们的任务。然后，我们将构建一个自定义连接器来管理实际的网络连接，使我们的运行时能够与 *hyper* 和其他类似的库无缝集成。

第一步是将以下内容导入到我们的程序中：

```rust
use std::net::Shutdown;
use std::net::{TcpStream, ToSocketAddrs};
use std::pin::Pin;
use std::task::{Context, Poll};

use anyhow::{bail, Context as _, Error, Result};
use async_native_tls::TlsStream;
use http::Uri;
use hyper::{Body, Client, Request, Response};
use smol::{io, prelude::*, Async};
```

我们可以构建自己的执行器，如下所示：

```rust
struct CustomExecutor;

impl<F: Future + Send + 'static> hyper::rt::Executor<F> for CustomExecutor {
    fn execute(&self, fut: F) {
        spawn_task!(async {
            println!("sending request");
            fut.await;
        }).detach();
    }
}
```

这段代码定义了我们的自定义执行器和 `execute` 函数的行为。在这个函数内部，我们调用 `spawn_task` 宏。在宏内部，我们创建一个异步块，并等待传入 `execute` 函数的期物。我们使用了 `detach` 函数；否则，通道将关闭，并且由于任务移出作用域被直接丢弃，我们将无法继续我们的请求。正如你可能从第3章回忆起来的，`detach` 将把任务的指针发送到一个循环中进行轮询，直到任务完成，然后才丢弃任务。

现在我们有了一个可以传递给 *hyper* 客户端的自定义执行器。然而，我们的 *hyper* 客户端仍然会请求失败，因为它期望连接由 *Tokio* 运行时管理。为了将 *hyper* 与我们的自定义异步运行时完全集成，我们需要构建自己的异步连接器，以独立于 *Tokio* 处理网络连接。

### 构建 HTTP 连接

当涉及到网络请求时，协议是定义良好且标准化的。例如，TCP 在发送数据包通过连接之前有一个三步握手来建立连接。从头开始实现 TCP 连接没有任何好处，除非你有非常特殊的需求，而标准化的连接协议无法提供。在图 4-1 中，我们可以看到 HTTP 和 HTTPS 是在传输协议（如 TCP）之上运行的应用层协议。

**图4-1. 网络协议层**

使用 HTTP 时，我们会发送主体、头部等。HTTPS 的步骤更多，因为在客户端开始发送数据之前，会检查并发送证书给客户端。这是因为数据需要加密。考虑到所有这些协议中的来回通信以及等待响应，网络请求是异步处理的合理目标。我们无法在不失去安全性和连接确认的情况下消除网络中的步骤。但是，我们可以在等待响应时通过异步释放 CPU 资源。

对于我们的连接器，我们将支持 HTTP 和 HTTPS，因此需要以下枚举：

```rust
enum CustomStream {
    Plain(Async<TcpStream>),
    Tls(TlsStream<Async<TcpStream>>),
}
```

`Plain` 变体是一个异步 TCP 流。考虑到图 4-1，我们可以推断 `Plain` 变体支持 HTTP 请求。对于 `Tls` 变体，我们记得 HTTPS 只是在 TCP 和 HTTP 之间的 TLS 层，这意味着我们的 `Tls` 变体支持 HTTPS。

现在我们可以使用这个自定义流枚举为自定义连接器结构体实现 *hyper* 的 `Service` trait：

```rust
#[derive(Clone)]
struct CustomConnector;

impl hyper::service::Service<Uri> for CustomConnector {
    type Response = CustomStream;
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, _: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        ...
    }
    fn call(&mut self, uri: Uri) -> Self::Future {
        ...
    }
}
```

`Service` trait 为连接定义了期物。我们的连接是一个线程安全的期物，返回我们的流枚举。这个枚举要么是一个异步 TCP 连接，要么是一个包装在 TLS 流中的异步 TCP 连接。

我们还可以看到，我们的 `poll_ready` 函数只是返回 `Ready`。这个函数被 *hyper* 用来检查服务是否准备好处理请求。如果我们返回 `Pending`，任务将被轮询，直到服务就绪。当服务无法再处理请求时，我们返回一个错误。因为我们正在为客户端调用实现 `Service` trait，所以对于 `poll_ready` 我们将始终返回 `Ready`。如果我们是为服务器实现 `Service` trait，我们可以有以下 `poll_ready` 函数：

```rust
fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Error>> {
    Poll::Ready(Ok(()))
}
```

我们可以看到，我们的 `poll_ready` 函数返回该期物已就绪。理想情况下，我们可以不定义 `poll_ready`，因为我们的实现使其调用变得多余。然而，这个函数是 `Service` trait 的要求。

我们现在可以继续看响应函数，也就是 `call`。`poll_ready` 函数需要在 `call` 被调用之前返回 `Ok`。我们的 `call` 函数有以下概要：

```rust
fn call(&mut self, uri: Uri) -> Self::Future {
    Box::pin(async move {
        let host = uri.host().context("cannot parse host")?;
        match uri.scheme_str() {
            Some("http") => {
                ...
            }
            Some("https") => {
                ...
            }
            scheme => bail!("unsupported scheme: {:?}", scheme),
        }
    })
}
```

我们记得，`pin` 和异步块返回一个期物。所以，我们固定的期物将是异步块的返回语句。对于我们的 HTTPS 块，我们使用以下代码构建一个期物：

```rust
let socket_addr = {
    let host = host.to_string();
    let port = uri.port_u16().unwrap_or(443);
    smol::unblock(move || (host.as_str(), port).to_socket_addrs())
        .await?
        .next()
        .context("cannot resolve address")?
};

let stream = Async::<TcpStream>::connect(socket_addr).await?;
let stream = async_native_tls::connect(host, stream).await?;
Ok(CustomStream::Tls(stream))
```

端口是 443，因为这是 HTTPS 的标准端口。然后我们传递一个闭包到 `unblock` 函数。这个闭包返回套接字地址。`unblock` 函数在线程池上运行阻塞代码，这样我们就可以在阻塞代码上拥有异步接口。当我们解析套接字地址时，我们可以释放线程去做其他事情。我们连接 TCP 流，然后将其连接到我们的原生 TLS。一旦连接成功，我们最终返回 `CustomStream` 枚举。

当涉及到构建我们的 HTTP 代码时，几乎是一样的。端口是 80 而不是 443，并且不需要 TLS 连接，从而导致返回 `Ok(CustomStream::Plain(stream))`。

现在我们的 `call` 函数已经定义好了。然而，如果我们此时尝试用我们的流枚举或连接结构体向网站发出 HTTPS 调用，我们会收到一条错误消息，说明我们尚未为流 trait 实现 *Tokio* 的 `AsyncRead` 和 `AsyncWrite` trait。这是因为 *hyper* 要求实现这些 trait 才能使用我们的连接枚举。

### 实现 Tokio 的 AsyncRead Trait

`AsyncRead` trait 类似于 `std::io::Read` trait，但与异步任务系统集成。在实现 `AsyncRead` trait 时，我们只需要定义 `poll_read` 函数，该函数返回一个 `Poll` 枚举作为结果。如果我们返回 `Poll::Ready`，表示数据已立即读取并放入输出缓冲区。如果我们返回 `Poll::Pending`，表示没有数据被读取到我们提供的缓冲区中。我们还表示 I/O 对象当前不可读，但将来可能变得可读。返回 `Pending` 会导致当前期物的任务在对象可读时被安排取消停放。我们可以返回的最终 `Poll` 枚举变体是 `Ready`，但带有错误，这通常是标准的 I/O 错误。

`AsyncRead` trait 的实现如下代码所示：

```rust
impl tokio::io::AsyncRead for CustomStream {
    fn poll_read(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut tokio::io::ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        match &mut *self {
            CustomStream::Plain(s) => {
                Pin::new(s)
                    .poll_read(cx, buf.initialize_unfilled())
                    .map_ok(|size| {
                        buf.advance(size);
                    })
            }
            CustomStream::Tls(s) => {
                Pin::new(s)
                    .poll_read(cx, buf.initialize_unfilled())
                    .map_ok(|size| {
                        buf.advance(size);
                    })
            }
        }
    }
}
```

我们的其他流本质上得到了相同的处理；我们传入异步 TCP 流或带有 TLS 的异步 TCP 流。然后我们固定这个流并执行流的 `poll_read` 函数，该函数执行读取并返回一个 `Poll` 枚举，指示由于读取缓冲区增长了多少。一旦 `poll_read` 完成，我们执行 `map_ok`，它接受一个 `FnOnce(T)`，这是一个只能调用一次的函数或闭包。

在 `map_ok` 的上下文中，闭包的目的是根据 `poll_read` 返回的大小推进缓冲区。对于每次读取，这是一次性操作，因此 `FnOnce` 足够且更合适。如果闭包需要被多次调用，则需要 `Fn` 或 `FnMut`。通过使用 `FnOnce`，我们确保闭包可以获取其捕获的环境的所有权，为闭包能做什么提供了灵活性。这在异步编程中尤其有用，因为在异步编程中必须仔细管理所有权和生命周期。

`map_ok` 也引用自身，即来自 `poll_read` 的结果。如果 `Poll` 结果是 `Ready` 但带有错误，则返回带有错误的 `Ready`。如果 `Poll` 结果是 `Pending`，则返回 `Pending`。我们将上下文传递给 `poll_read`，这样当结果为 `Pending` 时就会使用唤醒器。如果结果是 `Ready` 并带有 `Ok` 结果，则调用闭包并传入 `poll_read` 的结果，并且 `Ready Ok` 从 `map_ok` 函数返回。我们传递给 `map_ok` 函数的闭包推进了缓冲区。

底层发生了很多事情，但本质上，我们的流被固定，对固定流的读取被执行，如果读取成功，我们推进缓冲区填充区域的大小，因为读取的数据现在在缓冲区中。`poll_read` 中的轮询以及 `map_ok` 中对 `Poll` 枚举的匹配使得这个读取过程与异步运行时兼容。

现在我们可以异步地读取到缓冲区了，但为了完成 HTTP 请求，我们还需要异步地写入。

### 实现 Tokio 的 AsyncWrite Trait

`AsyncWrite` trait 类似于 `std::io::Write`，但与异步任务系统交互。它异步写入字节，并且与我们刚刚实现的 `AsyncRead` 一样，来自 *Tokio*。

实现 `AsyncWrite` trait 时，我们需要以下概要：

```rust
impl tokio::io::AsyncWrite for CustomStream {
    fn poll_write(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        ...
    }
    fn poll_flush(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        ...
    }
    fn poll_shutdown(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        ...
    }
}
```

`poll_write` 函数应该不会让人感到意外，但请注意，我们还有 `poll_flush` 和 `poll_shutdown` 函数。所有这些函数都返回 `Poll` 枚举的一个变体并接受上下文。因此，我们可以推断所有函数都能够使任务休眠以便再次被唤醒，并检查期物是否准备好关闭、刷新和写入连接。

我们应该从 `poll_write` 函数开始：

```rust
match &mut *self {
    CustomStream::Plain(s) => Pin::new(s).poll_write(cx, buf),
    CustomStream::Tls(s) => Pin::new(s).poll_write(cx, buf),
}
```

我们匹配流，固定流，然后执行流的 `poll_write` 函数。在这一点上，`poll_write` 尝试将字节从缓冲区写入对象，这应该不会令人惊讶。和读取一样，如果写入成功，返回写入的字节数。如果对象未准备好写入，我们将得到 `Pending`；如果我们得到 0，这通常意味着对象不再能够接受字节。

在流的 `poll_write` 函数内部，执行一个循环并获取 I/O 处理器的可变引用。然后循环反复尝试向底层 I/O 写入，直到缓冲区中的所有字节都被写入。每次写入尝试都有一个被处理的结果。如果写入错误是 `io::ErrorKind::WouldBlock`，这意味着写入无法立即完成，循环会重复直到写入完成。如果结果是任何其他错误，循环会通过返回 `Pending` 让期物稍后再次被轮询，来等待资源再次可用。

现在我们写好了 `poll_write`，可以定义 `poll_flush` 函数的主体了：

```rust
match &mut *self {
    CustomStream::Plain(s) => Pin::new(s).poll_flush(cx),
    CustomStream::Tls(s) => Pin::new(s).poll_flush(cx),
}
```

这与我们的 `poll_write` 函数具有相同的概要。但是，在这种情况下，我们在流上调用 `poll_flush`。刷新类似于写入，但我们确保缓冲区的所有内容立即到达目的地。刷新的底层机制与写入完全相同，都是循环，但在循环中会调用刷新函数，而不是写入函数。

我们现在可以继续最后一个函数，即 `shutdown`：

```rust
match &mut *self {
    CustomStream::Plain(s) => {
        s.get_ref().shutdown(Shutdown::Write)?;
        Poll::Ready(Ok(()))
    }
    CustomStream::Tls(s) => Pin::new(s).poll_close(cx),
}
```

我们实现自定义流不同类型的方式略有不同。`Plain` 流直接关闭。一旦它被关闭，我们就返回一个 `Ready` 的 `Poll`。然而，`Tls` 流本身是一个异步实现。因此，我们需要固定它，以避免它在内存中被移动，因为它可能会被多次放入任务队列直到轮询完成。我们调用 `poll_close` 函数，它将自行返回一个轮询结果。

现在我们已经为 *hyper* 客户端实现了异步读取和写入的 trait。我们现在需要做的就是连接并运行 HTTP 请求来测试我们的实现。

### 连接并运行我们的客户端

在本节中，我们将总结我们所做的工作并进行测试。我们可以创建我们的连接请求发送函数，如下所示：

```rust
impl hyper::client::connect::Connection for CustomStream {
    fn connected(&self) -> hyper::client::connect::Connected {
        hyper::client::connect::Connected::new()
    }
}

async fn fetch(req: Request<Body>) -> Result<Response<Body>> {
    Ok(Client::builder()
        .executor(CustomExecutor)
        .build::<_, Body>(CustomConnector)
        .request(req)
        .await?)
}
```

现在我们需要做的就是在主函数中的异步运行时上运行我们的 HTTP 客户端：

```rust
fn main() {
    Runtime::new().with_low_num(2).with_high_num(4).run();

    let future = async {
        let req = Request::get("https://www.rust-lang.org")
            .body(Body::empty())
            .unwrap();
        let response = fetch(req).await.unwrap();

        let body_bytes = hyper::body::to_bytes(response.into_body())
            .await.unwrap();
        let html = String::from_utf8(body_bytes.to_vec()).unwrap();
        println!("{}", html);
    };

    let test = spawn_task!(future);
    let _outcome = future::block_on(test);
}
```

现在我们成功了：我们可以运行我们的代码来从 Rust 网站获取 HTML 代码。我们现在可以说，我们的异步运行时可以与互联网进行异步通信了，但是接受请求呢？我们已经介绍了如何实现其他 crate 的 trait 来获得异步实现。所以，让我们再深入一步，用 *mio* crate 直接监听套接字中的事件。

### 介绍 mio

在实现套接字的异步功能时，如果不直接调用操作系统，我们真的无法比 *mio*（metal I/O）更底层了。这个 Rust 中的底层、非阻塞 I/O 库为创建高性能异步应用程序提供了构建块。它充当操作系统异步 I/O 能力的薄抽象层。

*mio* crate 之所以如此关键，是因为它是其他更高级别异步运行时（包括 *Tokio*）的基础。这些更高级别的库将复杂性抽象掉，使它们更易于使用。*mio* crate 对于需要对其 I/O 操作进行细粒度控制并希望优化性能的开发人员很有用。图 4-2 显示了 *Tokio* 是如何构建在 *mio* 之上的。

**图4-2. Tokio 如何构建于 mio 之上**

在本章前面，我们将 *hyper* 连接到我们的运行时。为了获得完整的图景，我们现在将探索 *mio* 并将其集成到我们的运行时中。在继续之前，我们需要在 `Cargo.toml` 中添加以下依赖项：

```toml
mio = {version = "1.0.2", features = ["net", "os-poll"]}
```

我们还需要这些导入：

```rust
use mio::net::{TcpListener, TcpStream};
use mio::{Events, Interest, Poll as MioPoll, Token};
use std::io::{Read, Write};
use std::time::Duration;
use std::error::Error;

use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};
```

### mio 与 hyper 对比

我们在本章中对 *mio* 的探索并不是创建 TCP 服务器的最佳方法。如果你想创建一个生产服务器，你应该采用类似于这个 *hyper* 示例的方法：

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr = SocketAddr::from([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await?;
    loop {
        let (stream, _) = listener.accept().await?;
        let io = TokioIo::new(stream);
        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(hello))
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
```

主线程等待传入数据，当传入数据到达时，会生成一个新任务来处理该数据。这使监听器能够准备好接受更多传入数据。虽然我们的 *mio* 示例将帮助你理解轮询 TCP 连接的工作原理，但在构建 Web 应用程序时，使用框架或库提供的监听器是最明智的。我们将讨论一些 Web 概念以给我们的示例提供上下文，但全面概述 Web 开发超出了本书的范围。

现在我们已经打好了所有基础，可以继续在期物中轮询 TCP 套接字了。

### 在期物中轮询套接字

*mio* crate 是为处理许多套接字（数千个）而构建的。因此，我们需要识别哪个套接字触发了通知。令牌使我们能够做到这一点。当我们向事件循环注册套接字时，我们向它传递一个令牌，并且该令牌在处理程序中被返回。令牌是一个围绕 `usize` 的结构体元组。这是因为每个操作系统都允许与套接字关联一个指针大小的数据。所以在处理程序中，我们可以有一个映射函数，其中令牌是键，我们用它来映射套接字。

*mio* 在这里不使用回调，因为我们想要零成本抽象，而令牌是唯一的方法。我们可以在 *mio* 之上构建回调、流和期物。

有了令牌，我们现在有以下步骤：

1.  向事件循环注册套接字。
2.  等待套接字就绪。
3.  使用令牌查找套接字状态。
4.  对套接字进行操作。
5.  重复。

我们的简单例子不需要映射，因此我们将使用以下代码定义我们的令牌：

```rust
const SERVER: Token = Token(0);
const CLIENT: Token = Token(1);
```

在这里，我们只需要确保我们的令牌是唯一的。传递给 `Token` 的整数用于将其与其他令牌区分开来。现在我们有了令牌，我们定义将轮询套接字的期物：

```rust
struct ServerFuture {
    server: TcpListener,
    poll: MioPoll,
}
impl Future for ServerFuture {

    type Output = String;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        . . .
    }
}
```

我们使用 `TcpListener` 来接受传入数据，使用 `MioPoll` 来轮询套接字并告诉期物套接字何时可读。在我们期物的 `poll` 函数内部，我们可以定义事件并轮询套接字：

```rust
let mut events = Events::with_capacity(1);

let _ = self.poll.poll(
    &mut events,
    Some(Duration::from_millis(200))
).unwrap();

for event in events.iter() {
    . . .
}
cx.waker().wake_by_ref();
return Poll::Pending
```

轮询将从套接字中提取事件到事件迭代器中。我们还将套接字轮询的超时设置为 200 毫秒。如果套接字中没有事件，我们继续处理而不产生任何事件，并返回 `Pending`。我们将继续轮询，直到得到一个事件。

当我们得到事件时，我们遍历它们。在前面的代码中，我们将容量设置为 1，但如果需要，我们可以增加容量以处理多个事件。处理事件时，我们需要明确事件类型。对于我们的期物，我们需要确保套接字可读并且令牌是 `SERVER` 令牌：

```rust
if event.token() == SERVER && event.is_readable() {
    let (mut stream, _) = self.server.accept().unwrap();
    let mut buffer = [0u8; 1024];
    let mut received_data = Vec::new();

    loop {
        . . .
    }
    if !received_data.is_empty() {
        let received_str = String::from_utf8_lossy(&received_data);
        return Poll::Ready(received_str.to_string())
    }
    cx.waker().wake_by_ref();
    return Poll::Pending
}
```

如果套接字包含数据，则该事件是可读的。如果我们的事件是正确的，我们提取 `TcpStream` 并在堆上定义一个 `received_data` 集合，使用缓冲区切片来执行读取。如果数据为空，我们返回 `Pending`，这样如果数据不存在，我们可以再次轮询套接字。然后我们将数据转换为字符串并用 `Ready` 返回它。这意味着在获取数据后，我们的套接字监听器就完成了。

如果我们希望套接字在程序的整个生命周期内持续被轮询，我们会生成一个分离的任务，将数据传递给异步函数来处理数据，如下所示：

```rust
if !received_data.is_empty() {
    spawn_task!(some_async_handle_function(&received_data))
        .detach();
    return Poll::Pending;
}
```

在我们的循环中，我们从套接字读取数据：

```rust
loop {
    match stream.read(&mut buffer) {
        Ok(n) if n > 0 => {
            received_data.extend_from_slice(&buffer[..n]);
        }
        Ok(_) => {
            break;
        }
        Err(e) => {
            eprintln!("Error reading from stream: {}", e);
            break;
        }
    }
}
```

接收到的消息是否大于缓冲区并不重要；我们的循环将继续提取所有要处理的字节，将它们添加到我们的 `Vec` 中。如果没有更多字节，我们可以停止循环以处理数据。

现在我们有了一个期物，它将持续被轮询，直到它接受来自套接字的数据。收到数据后，期物将终止。我们也可以让这个期物持续轮询套接字。我们可以认为，如果需要，我们可以使用这个持续轮询的期物来跟踪数千个套接字。我们会每个套接字一个期物，并向运行时生成数千个期物。既然我们已经定义了 `TcpListener` 逻辑，现在可以继续我们的客户端逻辑，通过套接字向我们的期物发送数据。

### 通过套接字发送数据

对于我们的客户端，我们将在主函数中运行所有内容：

```rust
fn main() -> Result<(), Box<dyn Error>> {
    Runtime::new().with_low_num(2).with_high_num(4).run();
    . . .
    Ok(())
}
```

在我们的 `main` 中，我们首先创建监听器和用于客户端的流：

```rust
let addr = "127.0.0.1:13265".parse()?;
let mut server = TcpListener::bind(addr)?;
let mut stream = TcpStream::connect(server.local_addr()?)?;
```

我们的例子只需要一个流，但我们可以根据需要创建多个流。我们用 *mio* 轮询器注册我们的服务器，并使用服务器和轮询器生成监听器任务：

```rust
let poll: MioPoll = MioPoll::new()?;
poll.registry()
    .register(&mut server, SERVER, Interest::READABLE)?;

let server_worker = ServerFuture{
    server,
    poll,
};

let test = spawn_task!(server_worker);
```

现在我们的任务正在持续轮询 TCP 端口以获取传入事件。然后我们用 `CLIENT` 令牌创建另一个用于可写事件的轮询器。如果套接字未满，我们可以写入它。如果套接字已满，则不再可写，需要刷新。我们的客户端轮询器采用以下形式：

```rust
let mut client_poll: MioPoll = MioPoll::new()?;
client_poll.registry()
    .register(&mut stream, CLIENT, Interest::WRITABLE)?;
```

使用 *mio*，我们还可以创建在套接字可读或可写时触发的轮询器：

```rust
.register(
    &mut server,
    SERVER,
    Interest::READABLE | Interest::WRITABLE
));
```

现在我们创建了轮询器，可以等待套接字变得可写，然后再写入它。我们使用这个轮询调用：

```rust
let mut events = Events::with_capacity(128);

let _ = client_poll.poll(
    &mut events,
    None
).unwrap();
```

注意超时是 `None`。这意味着我们当前线程将被阻塞，直到轮询调用产生事件。一旦我们有了事件，我们向套接字发送一条简单的消息：

```rust
for event in events.iter() {
    if event.token() == CLIENT && event.is_writable() {
        let message = "that's so dingo!\n";
        let _ = stream.write_all(message.as_bytes());
    }
}
```

消息已发送，因此我们可以阻塞线程，然后打印出消息：

```rust
let outcome = future::block_on(test);
println!("outcome: {}", outcome);
```

运行代码时，可能会得到以下输出：

```
Error reading from stream: Resource temporarily unavailable (os error 35)
outcome: that's so dingo!
```

它工作了，但我们得到了初始错误。这可能是非阻塞 TCP 监听器的结果；*mio* 是非阻塞的。`Resource temporarily unavailable` 错误通常是由套接字中没有可用数据引起的。这可能在创建 TCP 流时发生，但这并不是问题，因为我们在循环中处理这些错误并返回 `Pending`，以便套接字继续被轮询，如下所示：

```rust
use std::io::ErrorKind;
...
Err(ref e) if e.kind() == ErrorKind::WouldBlock => {
    cx.waker().wake_by_ref();
    return Poll::Pending;
}
```

通过 *mio* 的轮询功能，我们实现了通过 TCP 套接字进行异步通信。我们还可以使用 *mio* 通过 `UnixDatagram` 在进程之间发送数据。`UnixDatagram` 是仅限于在同一台机器上发送数据的套接字。因此，`UnixDatagram` 速度更快，需要更少的上下文切换，并且不必通过网络堆栈。

### 总结

我们终于让我们的异步运行时除了睡眠和打印之外还能做点事情了。在本章中，我们探讨了 trait 如何帮助我们将在第三方 crate 集成到我们的运行时中，并且我们更深入地通过 *mio* 轮询 TCP 套接字。当涉及到让自定义异步运行时运行时，只要你能访问 trait 文档，就没有什么能阻碍你了。如果你想更好地掌握到目前为止所获得的异步知识，你现在有能力创建一个处理各种端点的基本 Web 服务器。在 *mio* 中实现所有通信会很困难，但仅将其用于异步编程则容易得多。*hyper* 的 `HttpListener` 将覆盖协议复杂性，因此你可以专注于将请求作为异步任务传递以及向客户端的响应。

对于我们在本书中的旅程，我们正在探索异步编程，而不是 Web 编程。因此，我们将继续探讨如何使用异步编程来解决特定问题。我们将在第5章从协程开始。

## 第五章 协程

在本书的这个阶段，你应该对异步编程感到熟悉了。现在，当你在代码中看到 `await` 语法时，你已经了解了其背后关于期物、任务、线程和队列的运作机制。但是，异步编程的构建模块又如何呢？如果我们可以在不使用异步运行时的情况下让代码暂停和恢复，会怎样呢？更进一步，如果我们能利用这种暂停-恢复机制，通过普通测试来测试我们的代码，会怎样？这些测试可以探索代码在各种轮询顺序和配置下的行为。我们的暂停-恢复机制也可以作为同步代码和异步代码之间的接口。这就是协程发挥作用的地方。

到本章结束时，你将能够定义协程并解释其用途。你将能够将协程集成到自己的程序中，为那些原本需要大量内存的任务降低内存消耗。你还将能够通过协程模拟异步功能而无需异步运行时，并实现一个基本的执行器。这使你能够在不依赖异步运行时的情况下在主线程中获得异步功能。你还将能够精细控制协程的轮询时机和顺序。

在撰写本文时，我们使用的是 Rust 夜间版中的协程语法。到你阅读时，语法可能已经改变，或者协程语法可能已经进入 Rust 稳定版。虽然语法变化令人烦恼，但我们本章主要关注的是协程的基本原理。语法变化不会影响协程的整体实现方式和我们的使用方法。

### 介绍协程

在我们全面探索协程之前，你需要理解什么是协程以及为什么你想使用它。

#### 什么是协程？

**协程** 是一种特殊类型的程序，它可以暂停其执行，然后在稍后的时间点从暂停处恢复执行。这与常规的子程序（如函数）不同，常规子程序运行完成并通常会返回一个值或抛出错误。图5-1展示了这种对比。

**图5-1.** 常规子程序（左）与协程（右）对比

让我们来比较一下协程和子程序。子程序启动后，会从头执行到尾，且其任何特定实例仅返回一次。协程则不同，它可以通过多种方式退出。它可以像子程序一样完成，但也可以通过调用另一个协程（称为**让出**）退出，然后稍后返回到同一点。因此，协程通过存储状态来跟踪暂停时的状态。

协程并非 Rust 独有，许多语言都有协程的不同实现。它们都共享相同的基本特性，以允许暂停和恢复执行：

**非阻塞性**
当协程暂停时，它们不会阻塞执行线程。

**有状态性**
协程可以在暂停时存储其状态，并在恢复时从该状态继续。无需从头开始。

**协作性**
协程可以在受控的方式下暂停，并在稍后阶段恢复。

现在让我们思考一下协程与线程的相似之处。从表面上看，它们似乎很相似——执行任务，稍后暂停/恢复。区别在于调度。线程是**抢占式**调度的：任务被外部调度器中断，目的是稍后恢复该任务。相反，协程是**协作式**的：它可以在没有调度器或操作系统介入的情况下暂停或让出给另一个协程。

使用协程听起来很棒，那为什么还要费心使用 `async/await` 呢？与编程中的任何事情一样，这里存在权衡。我们先来看看一些优点。协程消除了对互斥体等同步原语的需要，因为协程运行在同一线程中。这可以使代码更容易理解和编写，这并非无关紧要的考虑。在单个线程中切换协程比在线程之间切换要便宜得多。这对于你可能花费大量时间等待的任务特别有用。想象一下，你需要跟踪100个文件的变化。让操作系统调度100个线程来循环检查每个文件将是一件痛苦的事情。上下文切换在计算上是昂贵的。相反，拥有100个协程来检查它们监控的文件是否已更改，然后在文件更改时将其发送到线程池进行处理，会更高效、更容易。

在单个线程中使用协程的主要缺点是你没有充分利用计算机的能力。在单个线程中运行程序意味着你没有将任务拆分到多个核心上。现在你知道了协程是什么，让我们来探索为什么应该使用它们。

#### 为什么使用协程？

在高层次上，协程使我们能够暂停一个操作，将控制权交还给执行协程的线程，然后在需要时恢复该操作。这听起来很像异步。异步任务可以通过轮询让出控制权以便执行另一个任务。通过多线程，我们可以通过通道和包装在 `Sync` 原语中的数据结构将数据发送到线程，并按需检查线程。而协程则使我们能够暂停一个操作，并通过唤醒器恢复，而无需异步运行时或线程。

这可能看起来有点抽象，但我们应该用一个简单的文件写入示例来说明使用协程的优势。假设我们正在接收大量整数，需要将它们写入文件。也许我们正在从另一个程序获取数字，我们无法在开始写入之前等待所有数字都接收完毕，因为这会占用太多内存。

对于这个练习，我们需要以下依赖：

```toml
[dependencies]
rand = "0.8.5"
```

在我们编写演示代码之前，需要以下导入：

```rust
#![feature(coroutines)]
#![feature(coroutine_trait)]
use std::fs::{OpenOptions, File};
use std::io::{Write, self};
use std::time::Instant;
use rand::Rng;

use std::ops::{Coroutine, CoroutineState};
use std::pin::Pin;
```

我们还需要在 `Cargo.toml` 中添加 `rand` crate。对于简单的文件写入示例，这些导入看起来可能有点多，但随着我们逐步完成这个例子，你会看到它们是如何使用的。宏是为了启用实验性特性。对于我们简单的文件写入示例，我们有如下函数：

```rust
fn append_number_to_file(n: i32) -> io::Result<()> {
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("numbers.txt")?;
    writeln!(file, "{}", n)?;
    Ok(())
}
```

这个函数打开文件并写入。现在我们想测试它并测量性能，因此我们生成20万个随机整数，循环遍历它们，写入文件。我们还用以下代码计时这个操作：

```rust
fn main() -> io::Result<()> {
    let mut rng = rand::thread_rng();
    let numbers: Vec<i32> = (0..200000).map(|_| rng.gen()).collect();

    let start = Instant::now();
    for &number in &numbers {
        if let Err(e) = append_number_to_file(number) {
            eprintln!("Failed to write to file: {}", e);
        }
    }
    let duration = start.elapsed();

    println!("Time elapsed in file operations is: {:?}", duration);
    Ok(())
}
```

在撰写本文时，该测试耗时4.39秒完成。这速度不算快；然而，这是因为我们每次都打开文件，这涉及到检查权限和更新文件元数据的开销。

我们现在可以使用协程来处理整数的写入。首先，我们定义包含文件描述符的结构体：

```rust
struct WriteCoroutine {
    pub file_handle: File,
}

impl WriteCoroutine {
    fn new(path: &str) -> io::Result<Self> {
        let file_handle = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)?;
        Ok(Self { file_handle })
    }
}
```

然后我们实现 `Coroutine` trait：

```rust
impl Coroutine<i32> for WriteCoroutine {
    type Yield = ();
    type Return = ();

    fn resume(mut self: Pin<&mut Self>, arg: i32)
    -> CoroutineState<Self::Yield, Self::Return> {
        writeln!(self.file_handle, "{}", arg).unwrap();
        CoroutineState::Yielded(())
    }
}
```

如类型 `type Yield = ();` 和 `type Return = ();` 所示，我们的协程结构设计为既不产生中间值，也不返回最终结果。我们稍后会讨论这一点，但重要的是我们返回 `CoroutineState::Yielded`。这类似于在期物中返回 `Pending`，但返回的是 `Yield` 类型的值。我们也可以返回 `CoroutineState::Complete`，这类似于期物中的 `Ready`。

在我们的测试中，我们可以创建协程并循环遍历数字，用以下代码调用 `resume` 函数：

```rust
let mut coroutine = WriteCoroutine::new(
    "numbers.txt"
).unwrap();
for &number in &numbers {
    Pin::new(&mut coroutine).resume(number);
}
```

我们更新后的测试将得到大约622.6毫秒的时间。这大约快了六倍。当然，我们也可以直接创建文件描述符并在循环中引用它来获得同样的效果，但这证明了在需要时暂停协程状态并恢复它是有好处的。我们设法将写入逻辑隔离，但不需要任何线程或异步运行时就能实现这种加速。协程可以成为线程和异步任务内部的构建模块，以暂停和恢复计算。

你可能已经注意到实现 `Future` trait 和 `Coroutine` trait 之间的相似之处。有两种可能的状态，根据两种可能的结果恢复或完成，并且协程和异步任务都可以暂停和恢复。可以说，从广义上讲，异步任务就是协程，区别在于它们被发送到不同的线程并由执行器轮询。

协程有很多用途。它们可以用来处理网络请求、大数据处理或 UI 应用程序。与使用回调相比，它们提供了一种更简单的处理异步任务的方式。使用协程，我们可以在单个线程中实现异步功能，而无需队列或定义好的执行器。

#### 用协程生成

你可能在其他语言（如 Python）中遇到过生成器的概念。**生成器** 是协程的一个子集，有时被称为**弱**协程。之所以这样称呼它们，是因为它们总是将控制权交还给调用它们的进程，而不是交给另一个协程。

生成器允许我们**惰性**执行操作。我们可以在需要时再执行，意味着惰性操作只在需要时产生输出值。这可能是执行计算、建立网络连接或加载数据。这种惰性求值在处理可能效率低下或不可行的大型数据集时特别有用。像 `range` 这样的迭代器也服务于类似的目的，允许你惰性地产生值序列。

值得注意的是，Rust 语言正在不断发展，其中一个发展领域是**异步生成器**。这些是特殊类型的生成器，可以在异步上下文中产生值。这个领域的工作正在进行中；详情请参阅 Rust RFC Book 网站。

让我们将这一理论付诸实践，编写我们的第一个简单生成器。

#### 在 Rust 中实现一个简单的生成器

假设我们想从一个数据文件中包含的大型数据结构中提取信息。数据文件非常大，理想情况下，我们不希望一次性将其全部加载到内存中。对于我们的示例，我们将使用一个非常小的只有五行的数据文件来演示流式处理。记住，这是一个教学示例；在现实世界中，使用生成器读取一个只有五行的数据文件会被认为是杀鸡用牛刀！你可以自己创建这个文件。我们已经在项目中保存了一个名为 `data.txt` 的数据文件，其中包含五行，每行有一个数字。

我们需要上一个例子中的协程特性，并导入这些组件：

```rust
#![feature(coroutines)]
#![feature(coroutine_trait)]
use std::fs::File;
use std::io::{self, BufRead, BufReader};
use std::ops::{Coroutine, CoroutineState};
use std::pin::Pin;
```

现在让我们创建 `ReadCoroutine` 结构体：

```rust
struct ReadCoroutine {
    lines: io::Lines<BufReader<File>>,
}

impl ReadCoroutine {
    fn new(path: &str) -> io::Result<Self> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);
        let lines = reader.lines();
        Ok(Self { lines })
    }
}
```

然后我们为这个结构体实现 `Coroutine` trait。我们的输入文件包含数字1到5，所以我们将产生一个 `i32`：

```rust
impl Coroutine<()> for ReadCoroutine {
    type Yield = i32;
    type Return = ();

    fn resume(mut self: Pin<&mut Self>, _arg: ())
    -> CoroutineState<Self::Yield, Self::Return> {
        match self.lines.next() {
            Some(Ok(line)) => {
                if let Ok(number) = line.parse::<i32>() {
                    CoroutineState::Yielded(number)
                } else {
                    CoroutineState::Complete(())
                }
            }
            Some(Err(_)) | None => CoroutineState::Complete(()),
        }
    }
}
```

协程包含一个 `Yield` 语句，允许我们从生成器中产生一个值。协程 trait 只有一个必需的方法，即 `resume`。这允许我们恢复执行，从之前的执行点继续。在我们的例子中，`resume` 方法从文件中读取行，将其解析为整数，并产生它们，直到没有更多的行可以产生，此时它完成。

现在我们将调用测试文件的函数：

```rust
fn main() -> io::Result<()> {
    let mut coroutine = ReadCoroutine::new("./data.txt")?;
    loop {
        match Pin::new(&mut coroutine).resume(()) {
            CoroutineState::Yielded(number) => println!("{:?}", number),
            CoroutineState::Complete(()) => break,
        }
    }

    Ok(())
}
```

你应该得到这个输出：

```
1
2
3
4
5
```

`Coroutine` trait 以前被称为 `Generator` trait 和 `GeneratorState`，名称变更发生在2023年底。如果你已经安装了旧版本的 Rust 夜间版，你需要更新它以使用以下代码。

现在我们将继续学习如何将两个协程一起使用，让它们相互让出。在这里你将开始看到使用协程的一些威力。

#### 堆叠我们的协程

在本节中，我们将使用文件传输来演示如何顺序使用两个协程。这很有用，因为我们可能想要传输一个非常大的文件，大到无法将所有数据装入内存。但是一点一点地传输数据将使我们能够传输所有数据而不会耗尽内存。为了实现这个解决方案，一个协程读取文件并产生值，而另一个协程接收这些值并将它们写入文件。

我们将重用 `ReadCoroutine` 并加入本章第一节中的 `WriteCoroutine`。在那个例子中，我们向一个名为 `numbers.txt` 的文件写入了20万个随机数。让我们将其重新用作我们希望传输的文件。我们将读取 `numbers.txt` 并写入一个名为 `output.txt` 的文件。

我们稍微重写 `WriteCoroutine`，使其接受一个路径而不是硬编码：

```rust
struct WriteCoroutine {
    pub file_handle: File,
}

impl WriteCoroutine {
    fn new(path: &str) -> io::Result<Self> {
        let file_handle = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)?;
        Ok(Self { file_handle })
    }
}
```

现在我们创建一个包含读写协程的管理器：

```rust
struct CoroutineManager {
    reader: ReadCoroutine,
    writer: WriteCoroutine
}
```

我们需要创建一个启动文件传输的函数。首先，我们将创建 `new` 函数来实例化协程管理器。它设置读和写的文件路径。其次，我们将创建一个名为 `run` 的新函数。我们需要在内存中固定读写协程，以便它们可以在程序的整个生命周期内使用。

然后我们将创建一个包含读和写功能的循环。读取器被匹配为 `Yielded` 或 `Complete`。如果它是 `Yielded`（即，有输出），写入协程接收这个输出并将其写入文件。

如果没有更多的数字可读，我们就中断循环。代码如下：

```rust
impl CoroutineManager {
    fn new(read_path: &str, write_path: &str) -> io::Result<Self> {
        let reader = ReadCoroutine::new(read_path)?;
        let writer = WriteCoroutine::new(write_path)?;

        Ok(Self {
            reader,
            writer,
        })
    }
    fn run(&mut self) {
        let mut read_pin = Pin::new(&mut self.reader);
        let mut write_pin = Pin::new(&mut self.writer);

        loop {
            match read_pin.as_mut().resume(()) {
                CoroutineState::Yielded(number) => {
                    write_pin.as_mut().resume(number);
                }
                CoroutineState::Complete(()) => break,
            }
        }
    }
}
```

我们可以在 `main` 中使用它：

```rust
fn main() {
    let mut manager = CoroutineManager::new(
        "numbers.txt", "output.txt"
    ).unwrap();
    manager.run();
}
```

运行此程序后，你可以打开新的 `output.txt` 文件来检查内容是否正确。

让我们回顾一下我们在这里做了什么。本质上，我们创建了一个文件传输。一个协程逐行读取文件，并将其产生的值让出给另一个协程。这个协程接收值并写入文件。在这两个过程中，文件句柄在整个执行期间都保持打开状态，这意味着我们不必一直与缓慢的 I/O 竞争。通过这种惰性加载和写入，我们可以安排程序依次处理多个文件传输。放大来看，你可以看到这种方法的好处。我们可以用它来将100个每个都有几 GB 的大文件从一个位置移动到另一个位置，甚至通过网络移动。

#### 从一个协程调用另一个协程

在前面的例子中，我们使用一个协程产生一个值，然后该值被写入协程接收。这个过程由管理器处理。在理想情况下，我们希望完全消除管理器的需要，让协程直接相互调用并来回传递。这些被称为**对称协程**，在其他语言中使用。这个功能在 Rust 中还不是标准功能，为了实现类似的功能，我们需要放弃使用 `Yielded` 和 `Complete` 语法。

我们将创建自己的名为 `SymmetricCoroutine` 的 trait。它有一个函数 `resume_with_input`。该函数接受一个输入并提供输出：

```rust
trait SymmetricCoroutine {
    type Input;
    type Output;

    fn resume_with_input(
        self: Pin<&mut Self>, input: Self::Input
    ) -> Self::Output;
}
```

现在我们可以为 `ReadCoroutine` 实现这个 trait。它输出类型为 `i32` 的值。注意我们不再使用 `Yielded`，但仍然使用行解析器。这将输出我们需要的值：

```rust
impl SymmetricCoroutine for ReadCoroutine {
    type Input = ();
    type Output = Option<i32>;

    fn resume_with_input(
        mut self: Pin<&mut Self>, _input: ()
    ) -> Self::Output {
        if let Some(Ok(line)) = self.lines.next() {
            line.parse::<i32>().ok()
        } else {
            None
        }
    }
}
```

对于 `WriteCoroutine`，我们也实现这个 trait：

```rust
impl SymmetricCoroutine for WriteCoroutine {
    type Input = i32;
    type Output = ();

    fn resume_with_input(
        mut self: Pin<&mut Self>, input: i32
    ) -> Self::Output {
        writeln!(self.file_handle, "{}", input).unwrap();
    }
}
```

最后，我们在 `main` 中将其整合：

```rust
fn main() -> io::Result<()> {
    let mut reader = ReadCoroutine::new("numbers.txt")?;
    let mut writer = WriteCoroutine::new("output.txt")?;

    loop {
        let number = Pin::new(&mut reader).resume_with_input(());
        if let Some(num) = number {
            Pin::new(&mut writer).resume_with_input(num);
        } else {
            break;
        }
    }
    Ok(())
}
```

`main` 函数明确指示协程应该如何协同工作。这涉及手动调度，因此在技术上不符合真正对称协程的标准。我们是在模仿对称协程的一些功能作为教学练习。真正的对称协程会将控制权从读取器传递给写入器，而无需返回 `main` 函数；这受到 Rust 借用规则的限制，因为两个协程都需要引用彼此。尽管如此，这仍然是一个有用的示例，可以展示编写自己的协程如何提供更多功能。

现在我们将继续研究异步行为，以及我们如何用简单的协程来模拟其中的一些功能。

### 用协程模拟异步行为

对于这个练习，我们需要以下导入：

```rust
#![feature(coroutines, coroutine_trait)]
use std::{
    collections::VecDeque,
    future::Future,
    ops::{Coroutine, CoroutineState},
    pin::Pin,
    task::{Context, Poll},
    time::Instant,
};
```

在本章引言中，我们讨论了协程与异步编程的相似之处，因为执行被暂停，并在满足某些条件后恢复。一个强有力的论点可能是，所有异步编程都是协程的一个子集。异步运行时本质上就是跨线程的协程。

我们可以通过这个简单的例子来演示执行的暂停。首先，我们设置一个睡眠1秒的协程：

```rust
struct SleepCoroutine {
    pub start: Instant,
    pub duration: std::time::Duration,
}

impl SleepCoroutine {
    fn new(duration: std::time::Duration) -> Self {
        Self {
            start: Instant::now(),
            duration,
        }
    }
}
impl Coroutine<()> for SleepCoroutine {
    type Yield = ();
    type Return = ();

    fn resume(
        self: Pin<&mut Self>, _: ())
    -> CoroutineState<Self::Yield, Self::Return> {
        if self.start.elapsed() >= self.duration {
            CoroutineState::Complete(())
        } else {
            CoroutineState::Yielded(())
        }
    }
}
```

我们将创建三个 `SleepCoroutine` 实例，它们将同时运行。每个实例睡眠1秒。

我们创建一个计数器，并用它来循环遍历协程队列——让出或完成。最后，我们为整个操作计时：

```rust
fn main() {
    let mut sleep_coroutines = VecDeque::new();
    sleep_coroutines.push_back(
        SleepCoroutine::new(std::time::Duration::from_secs(1))
    );
    sleep_coroutines.push_back(
        SleepCoroutine::new(std::time::Duration::from_secs(1))
    );
    sleep_coroutines.push_back(
        SleepCoroutine::new(std::time::Duration::from_secs(1))
    );

    let mut counter = 0;
    let start = Instant::now();

    while counter < sleep_coroutines.len() {
        let mut coroutine = sleep_coroutines.pop_front().unwrap();
        match Pin::new(&mut coroutine).resume(()) {
            CoroutineState::Yielded(_) => {
                sleep_coroutines.push_back(coroutine);
            },
            CoroutineState::Complete(_) => {
                counter += 1;
            },
        }
    }
    println!("Took {:?}", start.elapsed());
}
```

这需要1秒完成，然而我们正在执行3个协程，每个都需要1秒完成。因此我们可能预计总共需要3秒。时间的缩短正是因为它们是协程：它们能够暂停执行并在稍后恢复。我们没有使用 Tokio 或任何其他异步运行时。所有操作都在单个线程中运行。它们只是暂停和恢复。

在某种程度上，我们为自己的用例编写了特定的执行器。我们甚至可以使用执行器语法使其更清晰。让我们创建一个使用 `VecDeque` 的 `Executor` 结构体：

```rust
struct Executor {
    coroutines: VecDeque<Pin<Box<
        dyn Coroutine<(), Yield = (), Return = ()>
    >>>,
}
```

现在我们添加 `Executor` 的基本功能：

```rust
impl Executor {
    fn new() -> Self {
        Self {
            coroutines: VecDeque::new(),
        }
    }
}
```

我们定义一个 `add` 函数，重用之前的代码，其中协程可以返回到队列：

```rust
fn add(&mut self, coroutine: Pin<Box<
    dyn Coroutine<(), Yield = (), Return = ()>>>)
{
    self.coroutines.push_back(coroutine);
}
```

最后，我们将协程状态代码包装到一个名为 `poll` 的函数中：

```rust
fn poll(&mut self) {
    println!("Polling {} coroutines", self.coroutines.len());
    let mut coroutine = self.coroutines.pop_front().unwrap();
    match coroutine.as_mut().resume(()) {
        CoroutineState::Yielded(_) => {
            self.coroutines.push_back(coroutine);
        },
        CoroutineState::Complete(_) => {}
    }
}
```

现在我们的 `main` 函数可以创建执行器，添加协程，然后轮询它们直到全部完成：

```rust
fn main() {
    let mut executor = Executor::new();
    for _ in 0..3 {
        let coroutine = SleepCoroutine::new(
            std::time::Duration::from_secs(1)
        );
        executor.add(Box::pin(coroutine));
    }
    let start = Instant::now();
    while !executor.coroutines.is_empty() {
        executor.poll();
    }
    println!("Took {:?}", start.elapsed());
}
```

就这样！我们创建了第一个执行器。我们将在第11章中在此基础上进行构建。既然我们已经通过协程和执行器基本实现了异步功能，让我们通过为 `SleepCoroutine` 实现 `Future` trait 来真正强化异步与协程之间的关系，代码如下：

```rust
impl Future for SleepCoroutine {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        match Pin::new(&mut self).resume(()) {
            CoroutineState::Complete(_) => Poll::Ready(()),
            CoroutineState::Yielded(_) => {
                cx.waker().wake_by_ref();
                Poll::Pending
            },
        }
    }
}
```

回顾一下，这个示例演示了协程的暂停和恢复，其方式与 `async/await` 的工作方式相似。不同之处在于我们在单个线程中使用协程。这里的主要缺点是你必须编写协程，并且如果需要，还要编写自己的执行器。这意味着它们可能与你试图解决的问题高度耦合。

除了这个主要缺点之外，我们还失去了拥有线程池的好处。当你定义自己的协程时，在异步运行可能过度杀鸡用牛刀的情况下可能是合理的。当我们想要额外的控制时，我们也可以使用协程。例如，当异步任务被发送到运行时后，我们无法真正控制它相对于其他异步任务的轮询时机。这就引出了我们的下一个主题，控制协程。

### 控制协程

在本书中，我们一直在内部控制异步任务的流程。例如，当我们实现 `Future` trait 时，我们可以根据 `poll` 函数的内部逻辑选择何时返回 `Pending` 或 `Ready`。对于我们的异步函数也是如此；我们选择异步任务何时通过 `await` 语法将控制权交还给执行器，并选择异步任务何时通过 `return` 语句返回 `Ready`。

我们可以通过外部的 `Sync` 原语（如原子值和互斥锁）来控制这些异步任务，让异步任务对这些原子值和互斥锁中的变化和值做出反应。然而，对外部信号做出反应的逻辑必须在将异步任务发送到运行时之前编码到异步任务中。对于简单的情况，这可以没问题，但如果异步任务周围的系统正在演变，这确实会使异步任务变得脆弱。这也使得异步任务更难在其他上下文中使用。异步任务可能还需要在执行前知道其他异步任务的状态，这可能会导致潜在的问题，如死锁。

如果任务 A 需要从任务 B 获得某些东西才能继续，而任务 B 需要从任务 A 获得某些东西才能继续，导致僵局，就会发生死锁。我们将在第11章介绍死锁、活锁以及其他潜在陷阱及其测试方法。

这就是协程易于外部控制的便利性发挥作用的地方。为了演示外部控制如何简化我们的程序，我们将编写一个简单的程序，循环遍历一个协程向量，这些协程具有一个值以及一个表示存活或死亡的状态。当协程被调用时，会为值生成一个随机数，然后产生这个值。我们可以累积所有这些值，并想出一个简单的规则来决定何时终止协程。对于随机数生成，我们需要这个依赖：

```toml
[dependencies]
rand = "0.8.5"
```

我们需要以下导入：

```rust
#![feature(coroutines, coroutine_trait)]
use std::{
    ops::{Coroutine, CoroutineState},
    pin::Pin,
    time::Duration,
};
use rand::Rng;
```

现在我们可以构建一个随机数协程：

```rust
struct RandCoRoutine {
    pub value: u8,
    pub live: bool,
}
impl RandCoRoutine {
    fn new() -> Self {
        let mut coroutine = Self {
            value: 0,
            live: true,
        };
        coroutine.generate();
        coroutine
    }
    fn generate(&mut self) {
        let mut rng = rand::thread_rng();
        self.value = rng.gen_range(0..=10);
    }
}
```

考虑到外部代码将控制我们的协程，我们使用一个简单的生成器实现：

```rust
impl Coroutine<()> for RandCoRoutine {
    type Yield = u8;
    type Return = ();

    fn resume(mut self: Pin<&mut Self>, _: ())
    -> CoroutineState<Self::Yield, Self::Return> {
        self.generate();
        CoroutineState::Yielded(self.value)
    }
}
```

我们可以在整个代码库中使用这个生成器，因为它名如其行。运行我们的协程不需要外部依赖，我们的测试也很简单。在我们的 `main` 函数中，我们创建一个这些协程的向量，调用它们直到向量中的所有协程都死亡：

```rust
let mut coroutines = Vec::new();
for _ in 0..10 {
    coroutines.push(RandCoRoutine::new());
}
let mut total: u32 = 0;

loop {
    let mut all_dead = true;
    for mut coroutine in coroutines.iter_mut() {
        if coroutine.live {
            . . .
        }
    }
    if all_dead {
        break
    }
}
println!("Total: {}", total);
```

如果循环中的协程是存活的，我们可以假设并非所有协程都已死亡，将 `all_dead` 标志设置为 `false`。然后我们调用协程的 `resume` 函数，提取结果，并想出一个简单的规则来决定是否终止协程：

```rust
all_dead = false;
match Pin::new(&mut coroutine).resume(()) {
    CoroutineState::Yielded(result) => {
        total += result as u32;
    },
    CoroutineState::Complete(_) => {
        panic!("Coroutine should not complete");
    },
}
if coroutine.value < 9 {
    coroutine.live = false;
}
```

如果我们在循环中降低终止协程的阈值，最终总和会更高，因为阈值更难达到。我们在主线程中，所以我们可以访问该线程中的所有内容。例如，我们可以跟踪所有死亡的协程，并在该数字变得太高时开始复活协程。我们也可以使用死亡数量来改变何时终止协程的规则。现在，我们仍然可以在异步任务中实现这个玩具示例。例如，一个期物可以持有并在其内部轮询另一个期物，以下面的简单示例为例：

```rust
struct NestingFuture {
    inner: Pin<Box<dyn Future<Output = ()> + Send>>,
}
impl Future for NestingFuture {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        match self.inner.as_mut().poll(cx) {
            Poll::Ready(_) => Poll::Ready(()),
            Poll::Pending => Poll::Pending,
        }
    }
}
```

没有什么能阻止 `NestingFuture` 拥有其他期物的向量，这些期物在每次被轮询时更新自己的 `value` 字段，并始终返回 `Pending` 作为结果。然后 `NestingFuture` 可以提取该 `value` 字段，并想出一个规则来决定最近轮询的期物是否应该被终止。然而，`NestingFuture` 将在异步运行时的一个线程中运行，导致对主线程中的数据访问有限。

考虑到协程易于控制，我们需要记住这并不是非此即彼的选择。并不是协程与异步的对抗。通过以下代码，我们可以证明我们可以将协程发送到线程：

```rust
let (sender, receiver) = std::sync::mpsc::channel::<RandCoRoutine>();
let _thread = std::thread::spawn(move || {
    loop {
        let mut coroutine = match receiver.recv() {
            Ok(coroutine) => coroutine,
            Err(_) => break,
        };
        match Pin::new(&mut coroutine).resume(()) {
            CoroutineState::Yielded(result) => {
                println!("Coroutine yielded: {}", result);
            },
            CoroutineState::Complete(_) => {
                panic!("Coroutine should not complete");
            },
        }
    }
});
std::thread::sleep(Duration::from_secs(1));
sender.send(RandCoRoutine::new()).unwrap();
sender.send(RandCoRoutine::new()).unwrap();
std::thread::sleep(Duration::from_secs(1));
```

因为协程是线程安全的，并且可以轻松映射协程的结果，我们可以完成对协程的理解之旅。我们可以得出结论，协程是一种可以暂停和恢复的计算单元。此外，这些协程还实现了 `Future` trait，可以调用 `resume` 函数并将该函数的结果映射到 `poll` 函数的结果，如图5-2所示。

**图5-2. 协程如何成为异步适配器**

图5-2还显示，我们可以在协程函数和未来函数之间插入可选的适配器代码。然后我们可以将协程视为基本的计算构建模块。这些协程可以在同步代码中暂停和恢复，因此易于在标准测试环境中测试，因为你不需要异步运行时间来测试这些协程。你还可以选择何时调用协程的 `resume` 函数，因此测试协程以不同顺序交互也很简单。

一旦你对协程及其工作方式感到满意，你可以将一个或多个协程包装在一个实现 `Future` trait 的结构体中。这个结构体本质上是一个适配器，使协程能够与异步运行时交互。这为我们提供了计算过程的测试和实现的终极灵活性和控制，并在这些计算步骤与异步运行时之间建立了清晰的边界，因为异步运行时基本上就是一个带队列的线程池。任何熟悉单元测试的人都知道，我们不应该为了测试函数或结构体的计算逻辑而必须与线程池通信。考虑到这一点，让我们通过对协程的测试来结束我们对协程在异步世界中如何适应的探索。

### 测试协程

对于我们的测试示例，我们不想用复杂的逻辑使本章过度膨胀，所以我们将测试两个协程，它们获取同一个互斥锁并将互斥锁中的值加一。这样，我们可以测试获取锁时会发生什么，以及交互后锁的最终结果。

虽然使用协程进行测试简单而强大，但如果你不使用协程，也并非完全束手无策。第11章专门介绍测试，你在那章里不会看到一个协程。

我们从一个结构体开始，该结构体有一个互斥锁的句柄和一个阈值，协程在达到阈值后将完成：

```rust
use std::ops::{Coroutine, CoroutineState};
use std::pin::Pin;
use std::sync::{Arc, Mutex};

pub struct MutexCoRoutine {
    pub handle: Arc<Mutex<u8>>,
    pub threshold: u8,
}
```

然后我们实现获取锁并将值加一的逻辑：

```rust
impl Coroutine<()> for MutexCoRoutine {
    type Yield = ();
    type Return = ();

    fn resume(mut self: Pin<&mut Self>, _: ())
    -> CoroutineState<Self::Yield, Self::Return> {
        match self.handle.try_lock() {
            Ok(mut handle) => {
                *handle += 1;
            },
            Err(_) => {
                return CoroutineState::Yielded(());
            },
        }
        self.threshold -=1;
        if self.threshold == 0 {
            return CoroutineState::Complete(())
        }
        return CoroutineState::Yielded(())
    }
}
```

我们尝试获取锁，但如果无法获取，我们不想阻塞，所以我们将返回一个 `yield`。如果我们获得了锁，我们将值加一，将阈值减一，然后根据阈值是否达到返回 `Yielded` 或 `Complete`。

异步函数中的阻塞代码会导致整个异步运行时停滞，因为它会阻止其他任务取得进展。在 Rust 中，这个概念通常被称为**函数颜色**，其中函数要么是同步的（阻塞），要么是异步的（非阻塞）。不恰当地混合这些会导致问题。

例如，如果 `Mutex` 的 `try_lock` 方法阻塞，这在异步上下文中将是有问题的。虽然 `try_lock` 本身是非阻塞的，但你应该意识到其他锁定机制（如 `lock`）会阻塞，因此应避免在异步函数中使用，或小心处理。

就是这样；我们可以使用以下模板在同一个文件中测试我们的协程：

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use std::future::Future;
    use std::task::{Context, Poll};
    use std::time::Duration;

    // 同步测试接口
    fn check_yield(coroutine: &mut MutexCoRoutine) -> bool {
        . . .
    }
    // 异步运行时接口
    impl Future for MutexCoRoutine {
        . . .
    }
    #[test]
    fn basic_test() {
        . . .
    }
    #[tokio::test]
    async fn async_test() {
        . . .
    }
}
```

在这里，我们将直接检查我们的代码如何工作，然后看看我们的代码在异步运行时中如何运行。我们有两个接口。我们不想为了满足测试而改变我们的代码。相反，我们有一个简单的接口，根据协程返回的类型返回一个布尔值；以下是函数定义：

```rust
fn check_yield(coroutine: &mut MutexCoRoutine) -> bool {
    match Pin::new(coroutine).resume(()) {
        CoroutineState::Yielded(_) => {
            true
        },
        CoroutineState::Complete(_) => {
            false
        },
    }
}
```

对于我们的异步接口，我们只需将协程输出映射到等效的异步输出：

```rust
impl Future for MutexCoRoutine {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Self::Output> {
        match Pin::new(&mut self).resume(()) {
            CoroutineState::Complete(_) => Poll::Ready(()),
            CoroutineState::Yielded(_) => {
                cx.waker().wake_by_ref();
                Poll::Pending
            },
        }
    }
}
```

现在我们准备在 `basic_test` 函数中构建第一个基本测试。我们首先定义互斥锁和协程：

```rust
let handle = Arc::new(Mutex::new(0));
let mut first_coroutine = MutexCoRoutine {
    handle: handle.clone(),
    threshold: 2,
};
let mut second_coroutine = MutexCoRoutine {
    handle: handle.clone(),
    threshold: 2,
};
```

我们首先想自己获取锁，然后调用两个协程，检查它们是否返回一个 `yield`，并且由于我们持有锁，互斥锁的值是否仍然是零：

```rust
let lock = handle.lock().unwrap();
for _ in 0..3 {
    assert_eq!(check_yield(&mut first_coroutine), true);
    assert_eq!(check_yield(&mut second_coroutine), true);
}
assert_eq!(*lock, 0);
std::mem::drop(lock);
```

你可能已经注意到，在测试完前两个 `yield` 后，我们丢弃了锁。如果我们不这样做，其余的测试将失败，因为我们的协程将永远无法获得锁。

我们执行循环以证明当协程未能获得锁时，阈值也没有被改变。如果阈值被改变了，经过两次迭代后协程将返回 `complete`，下一次调用协程将导致错误。虽然测试不需要循环也能发现这一点，但一开始就使用循环可以消除对导致测试中断的原因的困惑。

在我们丢弃锁之后，我们各调用协程两次，以确保它们返回我们期望的结果，并在所有调用之间检查互斥锁，以确保状态正以我们期望的确切方式改变：

```rust
assert_eq!(check_yield(&mut first_coroutine), true);
assert_eq!(*handle.lock().unwrap(), 1);
assert_eq!(check_yield(&mut second_coroutine), true);
assert_eq!(*handle.lock().unwrap(), 2);
assert_eq!(check_yield(&mut first_coroutine), false);
assert_eq!(*handle.lock().unwrap(), 3);
assert_eq!(check_yield(&mut second_coroutine), false);
assert_eq!(*handle.lock().unwrap(), 4);
```

我们的第一个测试完成了。

在异步测试中，我们以完全相同的方式创建互斥锁和协程。然而，我们现在测试的是我们的行为最终结果在异步运行时中是相同的，并且我们的异步接口正在按我们期望的方式工作。因为我们正在使用 Tokio 测试特性，我们可以直接生成我们的任务，等待它们，并检查锁：

```rust
let handle_one = tokio::spawn(async move {
    first_coroutine.await;
});
let handle_two = tokio::spawn(async move {
    second_coroutine.await;
});
handle_one.await.unwrap();
handle_two.await.unwrap();
assert_eq!(*handle.lock().unwrap(), 4);
```

如果我们运行 `cargo test` 命令，我们会看到两个测试都通过了。就这样！我们逐步检查了两个协程与一个互斥锁之间的交互，并在每次迭代之间检查了状态。我们的协程在同步代码中工作。但是，通过一个简单的适配器，我们也可以看到我们的协程在异步运行时中完全按照我们期望的方式工作！我们可以看到，在异步测试中，我们没有能力在协程的每次交互时检查互斥锁。异步执行器正在做它自己的事情。

### 总结

在本章中，我们通过实现 `Coroutine` trait 构建了自己的协程，并使用 `Yield` 和 `Complete` 来暂停和恢复协程。我们实现了一个管道，其中一个协程读取文件并产生值，这些值可以被第二个协程使用并写入文件。最后，我们构建了自己的执行器，并看到了协程是如何真正暂停和恢复的。

在你学习本章的过程中，你很可能注意到协程中的 `Yield`/`Complete` 与异步中的 `Pending`/`Ready` 之间的相似之处。在我们看来，最好的看待方式是 `async/await` 是协程的一个子类型。它是一种跨线程操作并使用队列的协程。你可以在协程和异步编程中暂停一个活动并在稍后返回。

协程使我们能够构建代码，因为它们可以作为异步和同步代码之间的接缝。通过协程，我们可以构建同步代码模块，然后使用标准测试进行评估。我们可以构建作为协程的适配器，这样我们的同步代码就可以连接到需要异步功能的代码，但这种异步功能以协程表示。然后，我们可以对协程进行单元测试，看看它们在被不同顺序和组合轮询时的行为。我们可以将这些协程注入到实现 `Future` trait 的结构体中，以便将我们的代码集成到异步运行时中，因为我们可以在未来的 `poll` 函数中调用协程。在这里，我们只需要通过接口隔离异步代码。一个异步函数可以调用你的代码，然后将输出传递给第三方异步代码，反之亦然。

隔离代码的一个好方法是使用反应式编程，我们的代码单元可以通过订阅广播通道来消费数据。我们将在第6章探讨这一点。

## 第六章 响应式编程  

*响应式编程* 是一种编程范式，其中的代码会对数据值或事件的变化做出反应。响应式编程使我们能够构建能够实时动态响应变化的系统。必须强调的是，本章是在异步编程的语境下撰写的。我们无法涵盖响应式编程的方方面面，因为这个主题已经有专门的著作。相反，我们将重点放在通过构建一个基本的加热系统来探讨异步轮询和响应数据变化的方法，在该系统中，期物会对温度变化做出反应。然后，我们将使用原子变量、互斥锁和队列来构建一个事件总线，使我们能够向多个订阅者发布事件。

通过本章的学习，你将熟悉足够多的异步数据共享概念，从而能够构建线程安全、可变的数据结构。这些数据结构可以被多个并发的异步任务安全地操作。你还将能够实现观察者模式。在本章结束时，你将掌握构建异步 Rust 解决方案的技能，以应对你在进一步阅读中会遇到的响应式设计模式。

我们首先从构建一个基本的响应式系统开始我们的响应式编程之旅。

### 构建一个基本的响应式系统

在构建基本的响应式系统时，我们将实现观察者模式。在这个模式中，我们有**主体**（subjects），然后有**观察者**（observers）订阅该主体的更新。当主体发布更新时，观察者通常会根据其特定要求对此更新做出反应。对于我们的基本响应式系统，我们将构建一个简单的加热系统。当温度低于设定值时，系统会打开加热器，如图6-1所示。

**图6-1. 我们基本的响应式加热系统**

在这个系统中，温度和期望温度是主体。加热器和显示器是观察者。如果温度下降到低于期望温度设定值，我们的加热器将打开。如果温度发生变化，我们的显示器将在终端打印出温度。在实际系统中，我们会直接将系统连接到温度传感器。然而，由于我们使用这个例子来探索响应式编程，我们绕开了硬件工程的细节，直接通过编码来模拟加热器和热量损失对温度的影响。现在我们的系统已经布局好了，我们可以开始定义我们的主体了。

#### 定义我们的主体

系统中的观察者将是持续轮询的期物，因为它们将在整个程序中持续轮询主体，以查看主体是否发生了变化。在我们开始构建温度系统之前，我们需要以下依赖项：

```toml
[dependencies]
tokio = { version = "1.26.0", features = ["full"] }
clearscreen = "2.0.1"
```

我们使用 `clearscreen` 来更新系统的显示，并使用 Tokio crate 来获得一个易于使用的异步运行时接口。`LazyLock`（现已成为标准库的一部分）允许我们惰性初始化变量，意味着它们只在首次访问时创建。有了这些依赖项，我们需要以下导入来构建我们的系统：

```rust
use std::sync::Arc;
use std::sync::atomic::{AtomicI16, AtomicBool};
use core::sync::atomic::Ordering;
use std::sync::LazyLock;
use std::future::Future;
use std::task::Poll;
use std::pin::Pin;
use std::task::Context;
use std::time::{Instant, Duration};
```

现在我们已经准备好了一切，我们可以定义我们的主体：

```rust
static TEMP: LazyLock<Arc<AtomicI16>> = LazyLock::new( || {
    Arc::new(AtomicI16::new(2090) )
});

static DESIRED_TEMP: LazyLock<Arc<AtomicI16>> = LazyLock::new( || {
    Arc::new(AtomicI16::new(2100) )
});

static HEAT_ON: LazyLock<Arc<AtomicBool>> = LazyLock::new( || {
    Arc::new(AtomicBool::new(false) )
});
```

这些主体有以下职责：

1.  **`TEMP`**: 系统的当前温度。
2.  **`DESIRED_TEMP`**: 我们希望房间达到的期望温度。
3.  **`HEAT_ON`**: 加热器是否应该打开。如果布尔值为 `true`，我们指示加热器打开。如果布尔值为 `false`，加热器将关闭。

如果你之前搜索过响应式编程或响应式系统，你可能读过关于传递消息和事件的内容。消息和事件当然是响应式编程的一部分，但我们需要记住，软件开发的一个重要部分是不要过度设计我们的系统。我们的系统越复杂，维护和更改就越困难。我们的系统有基本的反馈需求：加热器根据一个数字打开或关闭。如果我们深入探究在线程间发送消息的锁和通道，它们最终可以归结为用于锁的原子变量和其他处理数据的数据集合。就目前而言，仅使用原子变量就足够了，因为系统的需求很简单。

观察者订阅主体使我们的代码解耦。例如，我们可以通过让新的观察者来观察主体，轻松地增加观察者的数量。我们不必修改现有主体中的任何代码。

现在我们已经为主体准备好了一切，下一步是构建一个观察者来显示我们的主体并控制我们的 `HEAT_ON` 主体。

#### 构建我们的显示器观察者

现在我们的主体已经定义好了，我们可以定义我们的显示器期物：

```rust
pub struct DisplayFuture {
    pub temp_snapshot: i16,
}

impl DisplayFuture {
    pub fn new() -> Self {
        DisplayFuture {
            temp_snapshot: TEMP.load(Ordering::SeqCst)
        }
    }
}
```

当我们创建期物时，我们加载温度主体的值并将其存储起来。这里我们使用 `Ordering::SeqCst` 来确保温度值在所有线程中保持一致。这种严格的排序保证没有其他线程以一种我们无法察觉的方式修改了温度。

然后，我们可以使用这个存储的温度来与轮询时的温度进行比较：

```rust
impl Future for DisplayFuture {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output>
    {
        let current_snapshot = TEMP.load(Ordering::SeqCst); // 1
        let desired_temp = DESIRED_TEMP.load(Ordering::SeqCst);
        let heat_on = HEAT_ON.load(Ordering::SeqCst);

        if current_snapshot == self.temp_snapshot { // 2
            cx.waker().wake_by_ref();
            return Poll::Pending
        }
        if current_snapshot < desired_temp && heat_on == false { // 3
            HEAT_ON.store(true, Ordering::SeqCst);
        }
        else if current_snapshot > desired_temp && heat_on == true { // 4
            HEAT_ON.store(false, Ordering::SeqCst);
        }
        clearscreen::clear().unwrap(); // 5
        println!("Temperature: {}\nDesired Temp: {}\nHeater On: {}", // 6
            current_snapshot as f32 / 100.0,
            desired_temp as f32 / 100.0,
            heat_on);
        self.temp_snapshot = current_snapshot; // 7
        cx.waker().wake_by_ref();
        return Poll::Pending
    }
}
```

这段代码执行以下操作：

1.  我们获取整个系统的快照。
2.  我们检查期物持有的温度快照与当前温度之间是否存在差异。如果没有差异，就没有必要重新渲染显示器或做出任何加热决策，我们只是返回 `Pending`，结束轮询。
3.  我们检查当前温度是否低于期望温度。如果是，我们将 `HEAT_ON` 标志设置为 `true`。
4.  如果温度高于期望温度，我们将 `HEAT_ON` 标志设置为 `false`。
5.  我们清空终端以进行更新。
6.  我们打印快照的当前状态。
7.  我们更新期物所引用的快照。

最初，我们获取整个系统的快照。这种方法可能值得商榷。有些人认为我们应该在每一步都加载原子值。这样每次我们决定改变主体状态或显示它时，都能获取到状态的真实性质。这是一个合理的论点，但在做这类决策时总是存在权衡。

对于我们的系统，显示器是唯一会改变 `HEAT_ON` 标志状态的观察者，并且我们期物中的逻辑是基于温度来做决策的。然而，还有两个其他因素会影响温度，它们可能在快照和打印之间影响温度，如图6-2所示。

**图6-2. 在温度快照被打印之前影响温度的期物**

在我们的系统中，如果温度显示在瞬间稍有偏差，这并不要紧。可以认为，更重要的是获取快照，根据该快照做出决策，并打印该快照，以便查看用于做出决策的确切数据。这也能为我们提供清晰的调试信息。我们也可以先获取快照，根据该快照改变 `HEAT_ON` 标志的状态，然后在打印到控制台前加载每个原子变量，这样显示在打印的瞬间总是准确的。记录用于决策的快照，并在打印时立即加载原子变量，也是一种选择。

对于我们简单的系统，我们已经到了吹毛求疵的地步，我们将坚持打印快照，以便观察我们的系统如何适应和做出决策。然而，在构建响应式系统时，考虑这些权衡是很重要的。你的观察者正在操作的数据可能已经过时了。

对于我们的模拟，我们可以通过将运行时限制在只有一个线程来消除操作过时数据的风险。这将确保我们的快照不会过时，因为我们的显示器期物在处理时，另一个期物无法改变温度。除了将运行时限制为一个线程，我们还可以用互斥锁包装我们的温度，这也将确保我们的温度在快照和打印之间不会改变。

然而，我们的系统是对温度做出反应。温度并非我们的系统凭空创造出来的概念。热量损失和加热器可以实时影响我们的温度，如果我们想出一些技巧来避免在我们有其他进程改变主体状态时，系统中的温度发生变化，那我们只是在自欺欺人。

虽然我们的系统简单到不需要担心过时数据，但我们可以使用比较并交换功能，如标准库文档中的这个代码示例所示：

```rust
use std::sync::atomic::{AtomicI64, Ordering};

let some_var = AtomicI64::new(5);

assert_eq!(
    some_var.compare_exchange(
        5,
        10,
        Ordering::Acquire,
        Ordering::Relaxed
    ),
    Ok(5)
);
assert_eq!(some_var.load(Ordering::Relaxed), 10);

assert_eq!(
    some_var.compare_exchange(
        6,
        12,
        Ordering::SeqCst,
        Ordering::Acquire
    ),
    Err(10)
);
assert_eq!(some_var.load(Ordering::Relaxed), 10);
```

在这里，我们可以理解为什么原子变量被称为“原子”的，因为它们的操作是原子的。这意味着在对原子值执行操作时，不会发生其他事务。在 `compare_exchange` 函数中，我们在将其更新为新值之前，断言原子值是某个特定值。如果值不符合预期，我们返回一个包含原子实际值的错误。我们可以使用 `compare_exchange` 函数来提示观察者根据返回的值做出另一个决策，并尝试根据更新的信息对原子值进行另一次更新。现在我们已经介绍了足够的内容，以突出响应式编程中的数据并发问题以及提供解决方案的领域。我们可以继续构建带有加热器和热量损失观察者的响应式系统。

#### 构建我们的加热器和热量损失观察者

为了使我们的加热器观察者正常工作，我们需要读取 `HEAT_ON` 布尔值，而不关心温度。然而，加热器有一个时间因素。遗憾的是，在撰写本文时，我们生活在一个加热器不是即时工作的世界里；它们需要时间来加热房间。因此，与温度快照不同，我们的加热器期物有一个时间快照，这使我们的加热器期物具有以下形式：

```rust
pub struct HeaterFuture {
    pub time_snapshot: Instant,
}

impl HeaterFuture {
    pub fn new() -> Self {
        HeaterFuture {
            time_snapshot: Instant::now()
        }
    }
}
```

现在我们有了一个时间快照，我们可以引用它并在一定持续时间后提高温度，通过 `poll` 函数实现：

```rust
impl Future for HeaterFuture {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output>
    {
        if HEAT_ON.load(Ordering::SeqCst) == false { // 1
            self.time_snapshot = Instant::now();
            cx.waker().wake_by_ref();
            return Poll::Pending
        }
        let current_snapshot = Instant::now();
        if current_snapshot.duration_since(self.time_snapshot) <
            Duration::from_secs(3) { // 2
            cx.waker().wake_by_ref();
            return Poll::Pending
        }
        TEMP.fetch_add(3, Ordering::SeqCst); // 3
        self.time_snapshot = Instant::now();
        cx.waker().wake_by_ref();
        return Poll::Pending
    }
}
```

在我们的加热器期物中，我们执行以下步骤：

1.  如果 `HEAT_ON` 标志为 `false`，则尽快退出，因为什么也不会发生。我们希望尽快将期物从执行器中释放，以避免阻塞其他期物。
2.  如果持续时间未超过 3 秒，我们也退出，因为加热器生效的时间尚未过去。
3.  最后，时间已过去且 `HEAT_ON` 标志为 `true`，因此我们将温度提高 3 度。

当 `HEAT_ON` 标志为 `false` 或时间未过去时，我们会在每个退出机会更新 `self.time_snapshot`。如果我们不更新时间快照，我们的加热器期物可能在 `HEAT_ON` 标志为 `false` 的情况下被轮询，直到 3 秒过去。但只要 `HEAT_ON` 标志切换到 `true`，对温度的影响将是即时的。对于我们的加热器期物，我们需要在每次轮询之间重置状态。

对于我们的热量损失期物，我们有：

```rust
pub struct HeatLossFuture {
    pub time_snapshot: Instant,
}
impl HeatLossFuture {
    pub fn new() -> Self {
        HeatLossFuture {
            time_snapshot: Instant::now()
        }
    }
}
```

对于我们的热量损失期物，构造方法将与加热器期物相同，因为我们引用的是每次轮询之间经过的时间。然而，在这个 `poll` 函数中，我们只在效果发生后重置快照，因为在这个模拟中热量损失只是一个常数。我们建议你尝试自己构建这个期物。如果你尝试自己构建期物，它应该大致如下形式：

```rust
impl Future for HeatLossFuture {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output>
    {
        let current_snapshot = Instant::now();
        if current_snapshot.duration_since(self.time_snapshot) >
            Duration::from_secs(3) {
            TEMP.fetch_sub(1, Ordering::SeqCst);
            self.time_snapshot = Instant::now();
        }
        cx.waker().wake_by_ref();
        return Poll::Pending
    }
}
```

现在，我们有了所有将持续轮询的期物，只要程序在运行。运行以下代码中的所有期物将导致一个持续更新温度并显示加热器是否开启的显示器：

```rust
#[tokio::main]
async fn main() {
    let display = tokio::spawn(async { DisplayFuture::new().await; });
    let heat_loss = tokio::spawn(async { HeatLossFuture::new().await; });
    let heater = tokio::spawn(async { HeaterFuture::new().await; });

    display.await.unwrap();
    heat_loss.await.unwrap();
    heater.await.unwrap();
}
```

当达到期望温度后，你应该会看到它围绕期望温度轻微振荡。

振荡在经典系统理论中是常见的。如果我们在显示器上增加一个时间快照并延迟 `HEAT_ON` 标志的切换，振荡将会变大。需要注意振荡。如果一个观察者的反应延迟，而另一个观察者又延迟地对第一个观察者的结果做出反应，你可能会得到一个非常难以理解或预测的混沌系统。这是 COVID-19 大流行期间及之后供应链中断的一个重要原因。Donella H. Meadows 的《系统思考》（Thinking in Systems）表明，需求的延迟反应会在供应链中造成振荡。长供应链有多个部分在振荡。如果振荡变得太不同步，你就会得到一个难以解决的混沌系统。这在一定程度上解释了为什么大流行后供应链需要很长时间才能恢复。幸运的是，计算机系统几乎是瞬间响应的。但要注意链接延迟并对它们做出反应的危险性。

现在我们的系统正在运行，我们可以继续使用回调来获取用户输入。

#### 通过回调获取用户输入

要从终端获取用户输入，我们将使用 `device_query` crate，版本如下：

```toml
device_query = "1.1.3"
```

有了这个，我们使用这些 trait 和结构体：

```rust
use device_query::{DeviceEvents, DeviceState};
use std::io::{self, Write};
use std::sync::Mutex;
```

`device_query` crate 使用回调，这是一种异步编程的形式。回调用于将一个函数传入另一个函数。传入的函数随后被调用。我们可以用以下代码编写自己的基本回调函数：

```rust
fn perform_operation_with_callback<F>(callback: F)
where
    F: Fn(i32),
{
    let result = 42;
    callback(result);
}

fn main() {
    let my_callback = |result: i32| {
        println!("The result is: {}", result);
    };

    perform_operation_with_callback(my_callback);
}
```

我们刚才所做的仍然是阻塞的。我们可以通过使用一个持续循环的事件循环线程，使我们的回调对主线程非阻塞。这个循环然后接受作为回调的传入事件（图6-3）。

**图6-3. 事件循环**

例如，Node.js 服务器通常有一个线程池，事件循环将事件传递给该线程池。如果我们的回调有一个通道回到事件发出的源头，数据可以在方便时被发送回事件的源头。

对于我们的输入，我们必须跟踪设备状态和输入，使用以下代码：

```rust
static INPUT: LazyLock<Arc<Mutex<String>>> = LazyLock::new(|| {
    Arc::new(Mutex::new(String::new()))
});
static DEVICE_STATE: LazyLock<Arc<DeviceState>> = LazyLock::new(|| {
    Arc::new(DeviceState::new())
});
```

我们必须考虑代码的结构。现在，我们的显示器在显示器期物检查温度时更新，如果温度发生变化就更新显示器。然而，当我们有用户输入时，这就不再合适了。想一想，如果用户输入的更新只有在温度变化时才显示，这将不是一个好的应用程序。这将导致用户沮丧地多次按下同一个键，结果只在温度更新时看到他们的多次按键被执行。我们的系统需要在用户按下键的瞬间更新显示器。考虑到这一点，我们需要自己的渲染函数，可以在多个地方调用。这个函数的形式如下：

```rust
pub fn render(temp: i16, desired_temp: i16, heat_on: bool, input: String) {
    clearscreen::clear().unwrap();
    let stdout = io::stdout();
    let mut handle = stdout.lock();
    println!("Temperature: {}\nDesired Temp: {}\nHeater On: {}",
        temp as f32 / 100.0,
        desired_temp as f32 / 100.0,
        heat_on);
    print!("Input: {}", input);
    handle.flush().unwrap();
}
```

这个函数与我们的显示器类似，但我们也打印出输入。这意味着我们的 `DisplayFuture` 的 `poll` 函数调用渲染函数如下：

```rust
#[tokio::main]
async fn main() {
    let _guard = DEVICE_STATE.on_key_down(|key| {
        let mut input = INPUT.lock().unwrap();
        input.push_str(&key.to_string());
        std::mem::drop(input);
        render(
            TEMP.load(Ordering::SeqCst),
            DESIRED_TEMP.load(Ordering::SeqCst),
            HEAT_ON.load(Ordering::SeqCst),
            INPUT.lock().unwrap().clone()
        );
    });
    let display = tokio::spawn(async {
        DisplayFuture::new().await;
    });
    let heat_loss = tokio::spawn(async {
        HeatLossFuture::new().await;
    });
    let heater = tokio::spawn(async {
        HeaterFuture::new().await;
    });

    display.await.unwrap();
    heat_loss.await.unwrap();
    heater.await.unwrap();
}
```

注意 `_guard`，它是回调守卫。`device_query` crate 中的回调守卫在添加回调时返回。如果我们丢弃守卫，事件监听器将被移除。幸运的是，我们的主线程将被阻塞，直到我们退出程序，因为我们的显示器、热量损失和加热器任务将持续轮询，直到我们强制程序退出。

`on_key_down` 函数创建一个线程并运行一个事件循环。这个事件循环有鼠标和键盘移动的回调。一旦我们从键盘按键获得事件，我们将其添加到输入状态并重新渲染显示器。我们不会花太多精力将按键映射到显示器的各种效果，因为这有点偏离本章的目标。现在运行程序，你应该能看到输入随着你按下的键的轨迹而更新。

回调简单易实现。回调的执行流程也具有可预测性。然而，你可能会陷入嵌套回调的陷阱，这可能演变成一种称为“回调地狱”的情况。这导致代码难以维护和理解。

现在你有了一个接收用户输入的基本系统。如果你想进一步探索这个系统，可以修改输入代码以处理期望温度的变化。请注意，我们的系统只对基本数据类型做出反应。如果我们的系统需要复杂的数据类型来表示事件呢？此外，我们的系统可能需要知道事件的顺序并对所有事件做出反应才能正常工作。

并非每个响应式系统都仅仅是对当前时间的整数值做出反应。例如，如果我们要构建一个股票交易系统，我们会想知道股票的历史数据，而不仅仅是在我们轮询它时的当前价格。我们也不能保证轮询在异步中何时发生，所以当我们轮询股票价格事件时，我们希望访问自上次轮询以来发生的所有事件，以决定哪些事件是重要的。为此，我们需要一个可以订阅的事件总线。

#### 通过事件总线启用广播

事件总线是一个系统，它允许更广泛的系统各个部分发送包含特定信息的消息。与具有简单发布/订阅关系的广播通道不同，事件总线可以在多个站点停靠，只有少数特定的人会“下车”。这意味着我们可以有多个订阅者来接收来自单一源的更新，但这些订阅者可以要求只接收特定类型的消息，而不是每个广播的消息。我们可以让一个主体向事件总线发布一个事件。多个观察者可以按照发布顺序消费该事件。在本节中，我们将构建自己的事件总线，以探索其底层机制。然而，广播通道在像 Tokio 这样的 crate 中已经可用。

广播通道类似于无线电广播。当广播电台发出消息时，多个听众可以收听同一个消息，只要他们都调到同一个频道。在编程中，对于广播通道，多个侦听器可以订阅并接收相同的消息。广播通道与常规通道不同。在常规通道中，消息由程序的一部分发送，由另一部分接收。在广播通道中，消息由程序的一部分发送，同一个消息由程序的多个部分接收。

除非你有特定需求，否则使用现成的广播通道比构建自己的要好。

在构建我们的事件总线之前，我们需要以下依赖项：

```toml
tokio = { version = "1.26.0", features = ["full"] }
futures = "0.3.28"
```

我们需要这些导入：

```rust
use std::sync::{Arc, Mutex, atomic::{AtomicU32, Ordering}};
use tokio::sync::Mutex as AsyncMutex;
use std::collections::{VecDeque, HashMap};
use std::marker::Send;
```

现在我们已经准备好构建我们的事件总线结构体了。

#### 构建我们的事件总线结构体

因为异步编程需要跨线程发送结构体以供异步任务轮询，所以我们将不得不克隆每个已发布的事件，并将这些克隆的事件分发给每个订阅者消费。如果消费者因某种原因被延迟，消费者还需要能够访问事件的积压队列。消费者还需要能够取消订阅事件。考虑到所有这些因素，我们的事件总线结构体采用以下形式：

```rust
pub struct EventBus<T: Clone + Send> {
    chamber: AsyncMutex<HashMap<u32, VecDeque<T>>>,
    count: AtomicU32,
    dead_ids: Mutex<Vec<u32>>,
}
```

我们用 `T` 表示的事件需要实现 `Clone` trait 以便可以被克隆并分发给每个订阅者，以及实现 `Send` trait 以便跨线程发送。我们的 `chamber` 字段是订阅者通过特定 ID 访问其事件队列的地方。`count` 字段将用于分配 ID，`dead_ids` 将用于跟踪已取消订阅的消费者。

注意 `chamber` 互斥锁是异步的，而 `dead_ids` 互斥锁不是异步的。`chamber` 互斥锁是异步的，因为我们可能有大量订阅者循环并轮询 `chamber` 以访问他们的个人队列。我们不希望执行器被等待互斥锁的异步任务阻塞。这将大大降低系统的性能。然而，对于我们的 `dead_ids`，我们不会循环和轮询这个字段。它只会在消费者想要取消订阅时被访问。拥有一个阻塞式互斥锁也使我们能够轻松实现当句柄被丢弃时的取消订阅过程。我们将在构建句柄时详述这一点。

对于我们的事件总线结构体，我们现在可以实现以下函数：

```rust
impl<T: Clone + Send> EventBus<T> {
    pub fn new() -> Self {
        Self {
            chamber: AsyncMutex::new(HashMap::new()),
            count: AtomicU32::new(0),
            dead_ids: Mutex::new(Vec::new()),
        }
    }
    pub async fn subscribe(&self) -> EventHandle<T> {
        // ...
    }
    pub fn unsubscribe(&self, id: u32) {
        self.dead_ids.lock().unwrap().push(id);
    }
    pub async fn poll(&self, id: u32) -> Option<T> {
        // ...
    }
    pub async fn send(&self, event: T) {
        // ...
    }
}
```

我们所有的函数都有一个 `&self` 引用，没有可变引用。这是因为我们利用原子变量和互斥锁实现了内部可变性，可变引用在互斥锁内部，绕过了 Rust 一次只能有一个可变引用的规则。原子变量也不需要可变引用，因为我们可以执行原子操作。这意味着我们的事件总线结构体可以包装在 `Arc` 中，并被克隆多次以跨多个线程发送，使这些线程都能安全地对事件总线执行多个可变操作。对于我们的 `unsubscribe` 函数，我们只是将 ID 推送到 `dead_ids` 字段。我们将在第 132 页的“通过异步任务与我们的事件总线交互”中解释这背后的原因。

消费者需要做的第一个操作是调用总线的 `subscribe` 函数，其定义如下：

```rust
pub async fn subscribe(&self) -> EventHandle<T> {
    let mut chamber = self.chamber.lock().await;
    let id = self.count.fetch_add(1, Ordering::SeqCst);
    chamber.insert(id, VecDeque::new());
    EventHandle {
        id,
        event_bus: Arc::new(self),
    }
}
```

在这段代码中，我们返回一个 `EventHandle` 结构体，我们将在下一小节中定义句柄。我们将 `count` 加 1，使用新的 `count` 作为 ID，并在该 ID 下插入一个新队列。然后我们返回一个对 `self` 的引用，这是包装在 `Arc` 中的事件总线，与 ID 一起放入句柄结构体中，以允许消费者与事件总线交互。

将 `count` 加 1 并将其用作新的 ID 是分配 ID 的一种简单方法，但在高吞吐量的长运行系统中，最终可能会耗尽数字。如果这个风险是一个严肃的考虑因素，你可以添加另一个字段来回收已从 `dead_ids` 字段清除的 ID。在分配新 ID 时，可以从回收的 ID 中取出。然后只有在回收的 ID 中没有 ID 时，才增加 `count`。

现在消费者已经订阅了总线，它可以使用以下总线函数进行轮询：

```rust
pub async fn poll(&self, id: u32) -> Option<T> {
    let mut chamber = self.chamber.lock().await;
    let queue = chamber.get_mut(&id).unwrap();
    queue.pop_front()
}
```

我们在获取与 ID 相关的队列时直接使用 `unwrap`，因为我们将通过句柄进行交互，并且我们只能在订阅总线时获得该句柄。因此，我们知道该 ID 肯定在 `chamber` 中。由于每个 ID 都有自己的队列，每个订阅者可以按照自己的时间消费所有已发布的事件。这个简单的实现可以修改，使 `poll` 函数返回整个队列，用空队列替换现有队列。这种新方法减少了对总线的轮询调用，因为消费者循环遍历刚从总线 `poll` 函数调用中提取的队列。由于我们将自己的结构体作为事件，我们也可以创建一个时间戳 trait，并规定这是放置到总线上的事件所必需的。时间戳将使我们能够在轮询仅返回最近事件时丢弃已过期的事件。

现在我们已经定义了一个基本的 `poll` 函数，我们可以为总线构建 `send` 函数：

```rust
pub async fn send(&self, event: T) {
    let mut chamber = self.chamber.lock().await;
    for (_, value) in chamber.iter_mut() {
        value.push_back(event.clone());
    }
}
```

我们已经拥有了事件总线在其内部数据结构上运行所需的一切。我们现在需要构建我们自己的句柄。

#### 构建我们的事件总线句柄

我们的句柄需要一个 ID 和对总线的引用，以便句柄可以轮询总线。我们的句柄用以下代码定义：

```rust
pub struct EventHandle<'a, T: Clone + Send> {
    pub id: u32,
    event_bus: Arc<&'a EventBus<T>>,
}
impl<'a, T: Clone + Send> EventHandle<'a, T> {
    pub async fn poll(&self) -> Option<T> {
        self.event_bus.poll(self.id).await
    }
}
```

通过生命周期标注，我们可以看到句柄的生存期不能超过总线的生存期。我们必须注意，`Arc` 会计算引用，只有当我们的异步系统中没有指向总线的 `Arc` 时，才会丢弃总线。因此，我们可以保证总线将存活到我们系统中最后一个句柄，使我们的句柄线程安全。

我们还需要注意丢弃句柄。如果句柄从内存中移除，就无法访问与该句柄 ID 相关的队列，因为句柄存储了 ID。然而，事件会继续发送到该 ID 的队列。如果开发人员使用我们的队列，并且在其代码中丢弃句柄而没有显式调用 `unsubscribe` 函数，他们将拥有一个充满多个没有订阅者的队列的事件总线。这种情况会浪费内存，甚至可能根据特定参数增长到计算机内存耗尽的程度。这称为**内存泄漏**，这是一个真实的风险。图 6-4 是一张咖啡机的照片，它遭受的不是咖啡泄漏，而是内存泄漏。

为了防止内存泄漏，我们必须为我们的句柄实现 `Drop` trait，这将在句柄被丢弃时从事件总线取消订阅：

```rust
impl<'a, T: Clone + Send> Drop for EventHandle<'a, T> {
    fn drop(&mut self) {
        self.event_bus.unsubscribe(self.id);
    }
}
```

**图6-4. 一台显示内存泄漏的咖啡机，表明机器内存不足**

我们的句柄现在已经完成，我们可以使用它来安全地从总线消费事件，而不会有内存泄漏的风险。我们将使用我们的句柄来构建与事件总线交互的任务。

#### 通过异步任务与事件总线交互

在本章中，我们的观察者一直在实现 `Future` trait，并将主体的状态与观察者的状态进行比较。既然我们直接将事件流式传输到我们的 ID，我们可以轻松地使用异步函数实现一个消费者异步任务：

```rust
async fn consume_event_bus(event_bus: Arc<EventBus<f32>>) {
    let handle = event_bus.subscribe().await;
    loop {
        let event = handle.poll().await;
        match event {
            Some(event) => {
                println!("id: {} value: {}", handle.id, event);
                if event == 3.0 {
                    break;
                }
            },
            None => {}
        }
    }
}
```

对于我们的示例，我们流式传输一个浮点数，如果发送了 `3.0` 则中断循环。这只是出于教育目的，但实现逻辑来影响 `HEAT_ON` 原子布尔值将是微不足道的。如果我们不想过于积极地轮询事件总线，也可以在 `None` 分支上实现 Tokio 异步睡眠函数。

事件的创建速率有时可能大于事件被处理的速率。这导致事件积压，称为**背压**。背压可以通过超出本书范围的多种方法来解决。缓冲、流量控制、速率限制、批处理和负载均衡等概念可以在背压形成时帮助减少它。我们将在第 11 章介绍如何测试通道的背压。

我们还需要一个后台任务，在一定时间后批量清理 `dead_ids`。这个垃圾收集任务也可以通过异步函数定义：

```rust
async fn garbage_collector(event_bus: Arc<EventBus<f32>>) {
    loop {
        let mut chamber = event_bus.chamber.lock().await;
        let dead_ids = event_bus.dead_ids.lock().unwrap().clone();
        event_bus.dead_ids.lock().unwrap().clear();
        for id in dead_ids.iter() {
            chamber.remove(id);
        }
        std::mem::drop(chamber);
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    }
}
```

批量移除后，我们立即丢弃 `chamber`。我们不希望在未使用它时阻塞其他尝试访问 `chamber` 的任务。

在数据库系统中，不立即在删除请求发出时删除记录是一种常见做法。这称为**逻辑删除**（tombstoning）。相反，数据库会标记一条记录，以指示 GET 请求将该记录视为已删除。然后，垃圾收集过程会定期清理逻辑删除的记录。对每个删除请求都清理和重新分配存储空间是一种代价高昂的选择，因为你希望继续处理对数据库的异步请求。

我们已经准备好与事件总线交互所需的一切。现在，我们创建事件总线及其引用：

```rust
let event_bus = Arc::new(EventBus::<f32>::new());
let bus_one = event_bus.clone();
let bus_two = event_bus.clone();
let gb_bus_ref = event_bus.clone();
```

现在，即使 `event_bus` 直接被丢弃，其他引用也会因为 `Arc` 而保持 `EventBus<f32>` 存活。所有四个引用都必须被丢弃。然后我们启动消费者和垃圾收集进程任务：

```rust
let _gb = tokio::task::spawn(async {
    garbage_collector(gb_bus_ref).await
});
let one = tokio::task::spawn(async {
    consume_event_bus(bus_one).await
});
let two = tokio::task::spawn(async {
    consume_event_bus(bus_two).await
});
```

在这个例子中，我们冒着在两个任务订阅之前发送事件的风险，所以我们等待一秒，然后广播三个事件：

```rust
std::thread::sleep(std::time::Duration::from_secs(1));
event_bus.send(1.0).await;
event_bus.send(2.0).await;
event_bus.send(3.0).await;
```

第三个事件是 `3.0`，意味着消费任务将从总线取消订阅。我们可以打印 `chamber` 的状态，等待垃圾收集器清除 `dead_ids`，然后再次打印状态：

```rust
let _ = one.await;
let _ = two.await;
println!("{:?}", event_bus.chamber.lock().await);
std::thread::sleep(std::time::Duration::from_secs(3));
println!("{:?}", event_bus.chamber.lock().await);
```

运行此代码会给我们以下打印输出：

```
    id: 0 value: 1
    id: 1 value: 1
    id: 0 value: 2
    id: 1 value: 2
    id: 0 value: 3
    id: 1 value: 3
    {1: [], 0: []}
```

两个订阅者都收到了事件，并且当它们取消订阅时，垃圾收集正常工作。

事件总线是响应式编程的支柱。我们可以继续以动态方式添加和移除订阅者。我们可以控制事件的分配和消费方式，并且实现仅仅钩入事件总线的代码很简单。

### 总结

虽然本书的范围无法全面介绍响应式编程，但我们涵盖了其基本的异步属性，例如轮询主体以及通过我们自己编写的事件总线异步分发数据。现在你应该能够提出响应式编程的异步实现了。

响应式编程并不局限于只有一个程序和不同的线程及通道。响应式编程的概念可以应用于多台计算机和进程，其标题为“响应式系统”。例如，我们的消息总线可以向集群中的各个服务器发送消息。事件驱动系统在扩展架构时也很有用。我们必须记住，使用响应式编程时，解决方案有更多活动部件。只有当实时系统在性能上开始失败时，我们才转向事件驱动系统。一开始就采用响应式编程可能会导致解决方案复杂且难以维护，因此要小心。

你可能已经注意到，我们依赖 Tokio 来实现我们的异步代码。在第 7 章中，我们将介绍如何自定义 Tokio 来解决具有约束和细微差别的问题。为 Tokio 专门开设一整章可能被认为是有争议的，但它实际上是 Rust 生态系统中使用最广泛的异步运行时。

## 第七章 自定义 Tokio

在本书中，我们一直在示例中使用 *Tokio*，不仅因为它成熟稳定，还因为它语法清晰，只需一个宏就能运行异步示例。如果你在异步 Rust 代码库上工作过，很可能遇到过 *Tokio*。然而，到目前为止，我们仅使用这个 crate 来构建一个标准的 *Tokio* 运行时，然后将异步任务发送到该运行时。在本章中，我们将自定义我们的 *Tokio* 运行时，以便对任务在特定线程集中的处理方式进行精细控制。我们还将测试在异步运行时中对线程状态的不安全访问是否真正安全。最后，我们将介绍如何在异步运行时完成时启用优雅关闭。

通过本章的学习，你将能够配置 *Tokio* 运行时以解决你的特定问题。你还能够指定异步任务在哪个线程上独占处理，以便你的任务可以依赖线程特定的状态，从而可能减少访问数据所需的锁。最后，你将能够指定在程序收到 Ctrl-C 或 kill 信号时程序如何关闭。那么，让我们开始构建 Tokio 运行时吧。

跳过本章不会影响你对本书其余部分的理解，因为本章内容涵盖如何根据自己的喜好使用 *Tokio*。本章不介绍新的异步理论。

### 构建运行时

在第 3 章中，我们通过实现自己的任务生成函数展示了任务在异步运行时中是如何处理的。这让我们对任务的处理方式有了很大的控制权。我们之前的 *Tokio* 示例仅仅使用了 `#[tokio::main]` 宏。虽然这个宏对于以最少的代码实现异步示例很有用，但仅仅使用 `#[tokio::main]` 并不能让我们对异步运行时的实现方式有太多控制。为了探索 Tokio，我们可以先设置一个可以选择的 Tokio 运行时来调用。对于我们配置的运行时，需要以下依赖：

```toml
tokio = { version = "1.33.0", features = ["full"] }
```

我们还需要以下结构体和特征：

```rust
use std::future::Future;
use std::time::Duration;
use tokio::runtime::{Builder, Runtime};
use tokio::task::JoinHandle;
use std::sync::LazyLock;
```

为了构建我们的运行时，我们可以依靠 `LazyLock` 进行惰性求值，这样我们的运行时只定义一次，就像我们在第 3 章构建运行时时所做的那样：

```rust
static RUNTIME: LazyLock<Runtime> = LazyLock::new(|| {
    Builder::new_multi_thread()
        .worker_threads(4)
        .max_blocking_threads(1)
        .on_thread_start(|| {
            println!("runtime A 的线程正在启动");
        })
        .on_thread_stop(|| {
            println!("runtime A 的线程正在停止");
        })
        .thread_keep_alive(Duration::from_secs(60))
        .global_queue_interval(61)
        .on_thread_park(|| {
            println!("runtime A 的线程正在停放");
        })
        .thread_name("我们的自定义运行时 A")
        .thread_stack_size(3 * 1024 * 1024)
        .enable_time()
        .build()
        .unwrap()
});
```

我们获得了很多开箱即用的配置，包括以下属性：

`worker_threads`
处理异步任务的线程数。

`max_blocking_threads`
可以分配给阻塞任务的线程数。阻塞任务不允许切换，因为它没有 `await`，或者在 `await` 语句之间需要长时间的 CPU 计算。因此，线程在处理该任务时会阻塞相当长的时间。CPU 密集型任务或同步任务通常被称为阻塞任务。如果我们阻塞了所有线程，其他任务就无法启动。正如本书通篇所述，根据你的程序要解决的问题，这可能没问题。但是，例如，如果我们使用异步来处理传入的网络请求，我们仍然希望处理更多传入的网络请求。因此，通过 `max_blocking_threads`，我们可以限制可以生成的用于处理阻塞任务的额外线程数。我们可以使用运行时的 `spawn_blocking` 函数生成阻塞任务。

`on_thread_start/stop`
工作线程启动或停止时触发的函数。如果你想构建自己的监控，这会很有用。

`thread_keep_alive`
阻塞线程的超时时间。一旦阻塞线程的时间超过此限制，超时的任务将被取消。

`global_queue_interval`
调度器在关注新任务之前的 tick 次数。一个 tick 代表调度器轮询任务以查看其是否可以运行或需要等待的一个实例。在我们的配置中，经过 61 个 tick 后，调度器将处理一个发送到运行时的新任务。如果没有任务需要轮询，调度器将不等待 61 个 tick 就处理发送到运行时的新任务。公平性和开销之间存在权衡。tick 数越低，发送到运行时的新任务获得关注的速度就越快。然而，我们也会更频繁地检查队列中的新任务，这会产生开销。如果我们不断检查新任务而不是推进现有任务，系统效率可能会降低。我们还必须承认每个任务的 `await` 语句数量。如果我们的任务通常包含许多 `await` 语句，调度器需要处理很多步骤，在每个 `await` 语句上进行轮询才能完成任务。然而，如果任务只有一个 `await` 语句，调度器将需要更少的轮询来推进任务。Tokio 团队决定单线程运行时的默认 tick 数应为 31，多线程运行时为 61。多线程建议的 tick 数更高，因为多个线程正在消费任务，导致这些任务以更快的速度获得关注。

`on_thread_park`
当工作线程停放时触发的函数。当工作线程没有任务要消费时，通常会被停放。如果你想实现自己的监控，`on_thread_park` 函数会很有用。

`thread_name`
为运行时创建的线程命名。默认名称是 `tokio-runtime-worker`。

`thread_stack_size`
这允许我们确定为每个工作线程的堆栈分配的内存字节数。堆栈是存储局部变量、函数返回地址和函数调用管理的内存部分。如果你知道你的计算很简单并且想要节省内存，那么选择较低的堆栈大小是有意义的。在撰写本文时，此堆栈大小的默认值是 2 mebibytes (MiB)。

`enable_time`
为 Tokio 启用时间驱动器。

现在我们已经构建并配置了运行时，我们可以定义如何调用它：

```rust
pub fn spawn_task<F, T>(future: F) -> JoinHandle<T>
where
    F: Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    RUNTIME.spawn(future)
}
```

我们并不真正需要这个函数，因为我们可以直接调用我们的运行时。但是，值得注意的是，函数签名本质上与第 3 章中的 `spawn_task` 函数相同。唯一的区别是我们返回一个 Tokio 的 `JoinHandle`，而不是 `Task`。

现在我们知道如何调用运行时了，我们可以定义一个基本的期物：

```rust
async fn sleep_example() -> i32 {
    println!("睡眠 2 秒");
    tokio::time::sleep(Duration::from_secs(2)).await;
    println!("睡眠完成");
    20
}
```

然后我们运行我们的程序：

```rust
fn main() {
    let handle = spawn_task(sleep_example());
    println!("已生成任务");
    println!("任务状态: {}", handle.is_finished());
    std::thread::sleep(Duration::from_secs(3));
    println!("任务状态: {}", handle.is_finished());
    let result = RUNTIME.block_on(handle).unwrap();
    println!("任务结果: {}", result);
}
```

我们生成任务，然后等待任务完成，使用运行时的 `block_on` 函数。我们还定期检查任务是否完成。运行代码会得到以下打印输出：

```
runtime A 的线程正在启动
runtime A 的线程正在启动
正在睡眠 2 秒
runtime A 的线程正在启动
runtime A 的线程正在停放
runtime A 的线程正在停放
已生成任务
runtime A 的线程正在停放
任务状态: false
runtime A 的线程正在启动
runtime A 的线程正在停放
睡眠完成
runtime A 的线程正在停放
任务状态: true
任务结果: 20
```

虽然这个打印输出很长，但我们可以看到运行时开始创建工作线程，并且在所有工作线程创建之前就启动了我们的异步任务。因为我们只发送了一个异步任务，我们还可以看到空闲的工作线程正在被停放。到我们获得任务结果时，所有工作线程都已被停放。我们可以看到 Tokio 停放线程相当积极。这很有用，因为如果我们创建了多个运行时但并不总是使用其中一个，那么未使用的运行时将迅速停放其线程，从而减少资源使用量。

现在我们已经介绍了如何构建和自定义 Tokio 运行时，我们可以重新创建第 3 章中构建的运行时：

```rust
static HIGH_PRIORITY: LazyLock<Runtime> = LazyLock::new(|| {
    Builder::new_multi_thread()
        .worker_threads(2)
        .thread_name("高优先级运行时")
        .enable_time()
        .build()
        .unwrap()
});

static LOW_PRIORITY: LazyLock<Runtime> = LazyLock::new(|| {
    Builder::new_multi_thread()
        .worker_threads(1)
        .thread_name("低优先级运行时")
        .enable_time()
        .build()
        .unwrap()
});
```

这给了我们如图 7-1 所示的布局。

**图 7-1. 我们的 Tokio 运行时布局**

我们的两个 Tokio 运行时与第 3 章中具有两个队列和任务窃取的运行时之间的唯一区别是，高优先级运行时的线程不会从低优先级运行时窃取任务。此外，高优先级运行时有两个队列。差异并不太明显，因为线程在同一个运行时内窃取任务，所以只要我们不介意任务处理的确切顺序，它实际上就是一个队列。

我们还必须承认，当没有剩余的异步任务需要处理时，线程会被停放。如果我们的线程数多于核心数，操作系统将管理这些线程之间的资源分配和上下文切换。简单地增加超过核心数的线程数不会导致速度的线性提升。然而，如果我们为高优先级运行时设置三个线程，为低优先级运行时设置两个线程，我们仍然可以有效地分配资源。如果没有任务要在低优先级运行时中处理，那两个线程将被停放，高优先级运行时的三个线程将获得更多的 CPU 分配。

现在我们已经定义了线程和运行时，我们需要以不同的方式与这些线程交互。我们可以使用本地池来获得对任务流程的更多控制。

### 使用本地池处理任务

通过本地池，我们可以对处理异步任务的线程有更多的控制。在探索本地池之前，我们需要包含以下依赖项：

```toml
tokio-util = { version = "0.7.10", features = ["full"] }
```

我们还需要以下导入：

```rust
use tokio_util::task::LocalPoolHandle;
use std::cell::RefCell;
```

使用本地池时，我们将生成的异步任务绑定到特定的池。这意味着我们可以使用未实现 `Send` trait 的结构体，因为我们确保任务停留在特定线程上。然而，因为我们确保异步任务在特定线程上运行，我们将无法利用任务窃取；我们将无法开箱即用地获得标准 Tokio 运行时的性能。

为了了解异步任务如何映射到本地池，我们首先需要定义一些本地线程数据：

```rust
thread_local! {
    pub static COUNTER: RefCell<u32> = RefCell::new(1);
}
```

每个线程都可以访问其 `COUNTER` 变量。然后我们需要一个简单的异步任务，它阻塞线程一秒钟，增加该异步任务所在线程的 `COUNTER`，然后打印出 `COUNTER` 和数字：

```rust
async fn something(number: u32) -> u32 {
    std::thread::sleep(std::time::Duration::from_secs(3));
    COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
        println!("Counter: {} 对应: {}", *counter.borrow(), number);
    });
    number
}
```

通过这个任务，我们将看到本地池的配置如何处理多个任务。

在我们的主函数中，我们仍然需要一个 Tokio 运行时，因为我们仍然需要等待生成的任务：

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    let pool = LocalPoolHandle::new(1);
    // ...
}
```

我们的 Tokio 运行时有一个 `flavor` 参数，设为 `current_thread`。在撰写本文时，`flavor` 可以是 `CurrentThread` 或 `MultiThread`。`MultiThread` 选项在多个线程上执行任务。`CurrentThread` 在当前线程上执行所有任务。另一个 `flavor`，`MultiThreadAlt`，也声称在多个线程上执行任务，但不稳定。所以我们实现的运行时将在当前线程上执行所有任务，并且本地池中有一个线程。

现在我们定义了池，我们可以用它来生成任务：

```rust
let one = pool.spawn_pinned(|| async {
    println!("one");
    something(1).await
});
let two = pool.spawn_pinned(|| async {
    println!("two");
    something(2).await
});
let three = pool.spawn_pinned(|| async {
    println!("three");
    something(3).await
});
```

我们现在有了三个句柄，因此我们可以等待这些句柄并返回这些任务的总和：

```rust
let result = async {
    let one = one.await.unwrap();
    let two = two.await.unwrap();
    let three = three.await.unwrap();
    one + two + three
};
println!("结果: {}", result.await);
```

运行我们的代码时，我们得到以下打印输出：

```
one
Counter: 2 对应: 1
two
Counter: 3 对应: 2
three
Counter: 4 对应: 3
结果: 6
```

我们的任务是按顺序处理的，最高的 `COUNTER` 值是 4，这意味着所有任务都是在一个线程中处理的。现在，如果我们将本地池大小增加到 3，我们得到以下打印输出：

```
one
three
two
Counter: 2 对应: 1
Counter: 2 对应: 3
Counter: 2 对应: 2
结果: 6
```

所有三个任务在生成后立即开始处理。我们还可以看到 `COUNTER` 对每个任务的值都是 2。这意味着我们的三个任务被分配到了所有三个线程。

我们也可以专注于特定的线程。例如，我们可以将任务生成到索引为零的线程：

```rust
let one = pool.spawn_pinned_by_idx(|| async {
    println!("one");
    something(1).await
}, 0);
```

如果我们将所有任务都生成到索引为零的线程，我们会得到这个打印输出：

```
one
Counter: 2 对应: 1
two
Counter: 3 对应: 2
three
Counter: 4 对应: 3
结果: 6
```

我们的打印输出与单线程池相同，尽管池中有三个线程。如果我们将标准睡眠换成 Tokio 睡眠，我们将得到以下打印输出：

```
one
two
three
Counter: 2 对应: 1
Counter: 3 对应: 2
Counter: 4 对应: 3
结果: 6
```

因为 Tokio 睡眠是异步的，我们的单线程可以同时处理多个异步任务，但 `COUNTER` 访问发生在睡眠之后。我们可以看到 `COUNTER` 值是 4，这意味着尽管我们的线程同时处理了多个异步任务，但我们的异步任务从未跨越到另一个线程。

通过本地池，我们可以精细控制将任务发送到哪里进行处理。尽管我们牺牲了任务窃取，但出于以下优势，我们可能希望使用本地池：

**处理不可发送的期物**
如果期物无法在线程间发送，我们可以使用本地线程池处理它们。

**线程亲和性**
因为我们可以确保任务在特定线程上执行，所以我们可以利用其状态。一个简单的例子是缓存。如果我们需要计算或从其他资源（如服务器）获取值，我们可以将其缓存在特定线程中。该线程中的所有任务都可以访问该值，因此你发送到该特定线程的所有任务都不需要再次获取或计算该值。

**线程本地操作的性能**
你可以使用互斥锁和原子引用计数器跨线程共享数据。然而，线程的同步会带来一些开销。例如，获取一个其他线程也在获取的锁并非没有代价。如图 7-2 所示，如果我们有一个具有四个工作线程的标准 Tokio 异步运行时，并且我们的计数器是 `Arc<Mutex<T>>`，那么一次只有一个线程可以访问计数器。

**图 7-2. 互斥锁一次只允许一个 Tokio 线程访问它**

其他三个线程将不得不等待访问 `Arc<Mutex<T>>`。将计数器的状态保持为每个线程本地将消除该线程等待访问互斥锁的需要，从而加快进程。然而，每个线程中的本地计数器并不包含完整的情况。这些计数器不知道其他线程中其他计数器的状态。获取完整计数状态的一种方法可以是向每个线程发送一个获取计数器的异步任务，最后合并每个线程的结果。我们在第 149 页的“优雅关闭”中介绍了这种方法。线程内数据的本地访问也有助于在涉及 CPU 缓存数据时优化 CPU 密集型任务。

**安全访问不可发送的资源**
有时数据资源不是线程安全的。将该资源保存在一个线程中，并将任务发送到该线程中处理，是绕过这个问题的一种方法。

我们在整本书中都强调了阻塞任务可能阻塞线程的潜力。但是，必须强调的是，阻塞对我们本地池可能造成的损害可能更明显，因为我们没有任何任务窃取。使用 Tokio 的 `spawn_blocking` 函数将防止这种情况。

到目前为止，我们已经能够通过使用 `RefCell` 在异步任务中访问线程的状态。它使我们能够通过 Rust 在运行时检查借用规则来访问数据。然而，在 `RefCell` 中借用数据时，这种检查会带来一些开销。我们可以删除这些检查，仍然可以使用不安全代码安全地访问数据，这将在下一节中探讨。

### 直接访问线程数据（不安全）

为了消除对线程数据可变借用的运行时检查，我们需要将数据包装在 `UnsafeCell` 中。这意味着我们直接访问线程数据，而不进行任何检查。然而，我知道你在想什么。如果我们使用 `UnsafeCell`，那危险吗？可能危险，所以我们必须小心确保安全。

考虑我们的系统，我们有一个处理异步任务的单线程，这些任务不会转移到其他线程。我们必须记住，虽然这个单线程可以通过轮询同时处理多个异步任务，但它一次只能主动处理一个异步任务。因此，我们可以假设，当我们的一个异步任务正在访问 `UnsafeCell` 中的数据并进行处理时，没有其他异步任务在访问数据，因为 `UnsafeCell` 不是异步的。但是，我们需要确保在对数据的引用在作用域内时，我们没有 `await` 操作。如果我们这样做，我们的线程可能会上下文切换到另一个任务，而现有任务仍然持有对数据的引用。

我们可以通过在不安全代码中向数千个异步任务暴露一个哈希映射，并在每个任务中增加某个键的值来测试这一点。要运行此测试，我们需要以下导入：

```rust
use tokio_util::task::LocalPoolHandle;
use std::time::Instant;
use std::cell::UnsafeCell;
use std::collections::HashMap;
```

然后我们定义我们的线程状态：

```rust
use std::cell::UnsafeCell;
use std::collections::HashMap;
thread_local! {
    pub static COUNTER: UnsafeCell<HashMap<u32, u32>> = UnsafeCell::new
    (HashMap::new())
}
```

接下来，我们可以定义我们的异步任务，该任务将使用不安全代码访问和更新线程数据：

```rust
async fn something(number: u32) {
    tokio::time::sleep(std::time::Duration::from_secs(number as u64)).await;
    COUNTER.with(|counter| {
        let counter = unsafe { &mut *counter.get() };
        match counter.get_mut(&number) {
            Some(count) => {
                let placeholder = *count + 1;
                *count = placeholder;
            },
            None => {
                counter.insert(number, 1);
            }
        }
    });
}
```

我们加入了一个 Tokio 睡眠，其持续时间为输入的数字，以打乱异步任务访问线程数据的顺序。然后我们获取数据的可变引用并执行操作。注意我们访问数据的 `COUNTER.with` 块。这不是一个异步块，意味着我们在访问数据时不能使用 `await` 操作。在访问不安全数据时，我们无法上下文切换到另一个异步任务。在 `COUNTER.with` 块内部，我们使用不安全代码直接访问数据并增加计数。

测试完成后，我们需要打印出线程状态。因此，我们需要将一个异步任务传递到线程中执行打印操作，其形式如下：

```rust
async fn print_statement() {
    COUNTER.with(|counter| {
        let counter = unsafe { &mut *counter.get() };
        println!("Counter: {:?}", counter);
    });
}
```

我们现在有了一切，所以我们需要做的就是在我们的主异步函数中运行我们的代码。首先，我们设置我们的本地线程池，它只有一个线程，以及 10 万个 1 到 5 的序列：

```rust
let pool = LocalPoolHandle::new(1);
let sequence = [1, 2, 3, 4, 5];
let repeated_sequence: Vec<_> = sequence.iter()
    .cycle()
    .take(100000)
    .cloned()
    .collect();
```

这给了我们 50 万个具有不同 Tokio 睡眠持续时间的异步任务，我们将把它们扔到这个单线程中。然后我们遍历这些数字，分拆任务，每个任务调用我们的异步函数两次，这样发送到线程的任务会使线程在每个函数内部和函数之间进行上下文切换：

```rust
let mut futures = Vec::new();
for number in repeated_sequence {
    futures.push(pool.spawn_pinned(move || async move {
        something(number).await;
        something(number).await
    }));
}
```

我们确实鼓励线程在处理任务时进行多次上下文切换。这种上下文切换，加上不同的睡眠持续时间和高总任务数，如果我们在访问数据时发生冲突，将导致计数结果不一致。最后，我们遍历句柄，等待它们全部完成以确保所有异步任务都已执行，并使用以下代码打印计数：

```rust
for i in futures {
    let _ = i.await.unwrap();
}
let _ = pool.spawn_pinned(|| async {
    print_statement().await
}).await.unwrap();
```

最终结果应如下：

```
Counter: {2: 200000, 4: 200000, 1: 200000, 3: 200000, 5: 200000}
```

无论我们运行多少次，计数都将始终相同。在这里，我们不必执行诸如比较和交换之类的原子操作，也不必在发生不一致时进行多次尝试。我们也不需要等待锁。我们甚至不需要在获取数据的可变引用之前检查是否存在任何可变引用。在这种上下文下，我们的不安全代码是安全的。

我们现在可以使用线程的状态来影响我们的异步任务。但是，如果我们的系统关闭了会发生什么？我们可能希望有一个清理过程，以便在再次启动运行时可以重新创建我们的状态。这就是优雅关闭发挥作用的地方。

### 优雅关闭

在优雅关闭中，我们在程序关闭时捕获信号，以便在程序退出前执行一系列进程。这些进程可以是向其他程序发送信号、存储状态、清理事务，以及任何你想在程序退出前做的其他事情。

我们对此主题的第一个探索可以是 Ctrl-C 信号。通常，当我们通过终端运行 Rust 程序时，我们可以通过按 Ctrl-C 来停止程序，提示程序退出。但是，我们可以用 `tokio::signal` 模块覆盖这种抢先退出。为了真正证明我们已经覆盖了 Ctrl-C 信号，我们可以构建一个简单的程序，它必须接受 Ctrl-C 信号三次后才退出程序。我们可以通过构建后台异步任务来实现这一点，如下所示：

```rust
async fn cleanup() {
    println!("清理后台任务已启动");
    let mut count = 0;
    loop {
        tokio::signal::ctrl_c().await.unwrap();
        println!("收到 ctrl-c 信号!");
        count += 1;
        if count > 2 {
            std::process::exit(0);
        }
    }
}
```

接下来，我们可以运行后台任务并无限循环，使用以下主函数：

```rust
#[tokio::main]
async fn main() {
    tokio::spawn(cleanup());
    loop {
    }
}
```

运行我们的程序时，如果我们按三次 Ctrl-C，我们将得到以下打印输出：

```
清理后台任务已启动
^C收到 ctrl-c 信号!
^C收到 ctrl-c 信号!
^C收到 ctrl-c 信号!
```

我们的程序在发送三次信号后才退出。现在我们可以按照自己的意愿退出程序。然而，在我们继续之前，让我们在后台任务的循环中添加一个阻塞睡眠，然后再等待 Ctrl-C 信号，给出以下循环：

```rust
loop {
    std::thread::sleep(std::time::Duration::from_secs(5));
    tokio::signal::ctrl_c().await.unwrap();
    // ...
}
```

如果我们再次运行程序，在 5 秒过去之前按 Ctrl-C，程序将退出。由此，我们可以推断，只有当我们的程序直接等待信号时，它才会按照我们想要的方式处理 Ctrl-C 信号。我们可以通过生成一个管理异步运行时的线程来解决这个问题。然后使用主线程的其余部分来监听信号：

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    std::thread::spawn(|| {
        let runtime = tokio::runtime::Builder::new_multi_thread()
            .enable_all()
            .build()
            .unwrap();

        runtime.block_on(async { println!("Hello, world!"); });
    });
    let mut count = 0;
    loop {
        tokio::signal::ctrl_c().await.unwrap();
        println!("收到 ctrl-c 信号!");
        count += 1;
        if count > 2 {
            std::process::exit(0);
        }
    }
}
```

现在，无论我们的异步运行时在处理什么，我们的主线程都准备好响应 Ctrl-C 信号，但是我们的状态呢？在清理过程中，我们可以提取当前状态，然后将其写入文件，以便在程序再次启动时可以加载状态。读写文件很简单，所以我们将重点放在从上一节构建的所有隔离线程中提取状态。与上一节的主要区别在于，我们将把任务分配到四个隔离线程上。首先，我们可以将本地线程池包装在惰性求值中：

```rust
static RUNTIME: LazyLock<LocalPoolHandle> = LazyLock::new(|| {
    LocalPoolHandle::new(4)
});
```

我们需要定义提取线程状态的异步任务：

```rust
fn extract_data_from_thread() -> HashMap<u32, u32> {
    let mut extracted_counter: HashMap<u32, u32> = HashMap::new();
    COUNTER.with(|counter| {
        let counter = unsafe { &mut *counter.get() };
        extracted_counter = counter.clone();
    });
    return extracted_counter
}
```

我们可以通过每个线程发送此任务，这为我们提供了一种非阻塞的方式来对整个系统的总计数求和（图 7-3）。

**图 7-3. 从所有线程提取状态的流程**

我们可以使用以下代码实现图 7-3 中规划的过程：

```rust
async fn get_complete_count() -> HashMap<u32, u32> {
    let mut complete_counter = HashMap::new();
    let mut extracted_counters = Vec::new();
    for i in 0..4 {
        extracted_counters.push(RUNTIME.spawn_pinned_by_idx(|| async move {
            extract_data_from_thread()
        }, i));
    }
    for counter_future in extracted_counters {
        let extracted_counter = counter_future.await.unwrap_or_default();
        for (key, count) in extracted_counter {
            *complete_counter.entry(key).or_insert(0) += count;
        }
    }
    return complete_counter
}
```

我们调用 `spawn_pinned_by_idx` 以确保我们只向每个线程发送一个 `extract_data_from_thread` 任务。

我们现在准备好运行我们的系统，使用以下主函数：

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    let _handle = tokio::spawn( async {
        // ...
    });
    tokio::signal::ctrl_c().await.unwrap();
    println!("收到 ctrl-c 信号!");
    let complete_counter = get_complete_count().await;
    println!("完整计数器: {:?}", complete_counter);
}
```

我们在 `tokio::spawn` 内生成任务以增加计数：

```rust
let sequence = [1, 2, 3, 4, 5];
let repeated_sequence: Vec<_> = sequence.iter().cycle().take(500000)
    .cloned()
    .collect();

let mut futures = Vec::new();
for number in repeated_sequence {
    futures.push(RUNTIME.spawn_pinned(move || async move {
        something(number).await;
        something(number).await
    }));
}
for i in futures {
    let _ = i.await.unwrap();
}
println!("所有期物已完成");
```

我们的系统现在已经可以运行了。如果我们运行程序直到在按 Ctrl-C 之前看到所有期物完成的打印输出，我们会得到以下打印输出：

```
完整计数器: {1: 200000, 4: 200000, 2: 200000, 5: 200000, 3: 200000}
```

因为我们知道我们只使用 `spawn_pinned_by_idx` 函数向每个线程发送了一个提取任务，并且我们的总计数与我们通过一个线程运行所有任务时相同，所以我们可以得出结论，我们的数据提取是准确的。如果我们在期物完成之前按 Ctrl-C，我们应该会得到类似于这样的打印输出：

```
完整计数器: {2: 100000, 3: 32290, 1: 200000}
```

我们在程序完成之前退出了，我们得到了当前状态。如果我们愿意，我们的状态现在可以在退出前被写入。

虽然我们的代码便于在按 Ctrl-C 时进行清理，但这个信号并不总是关闭系统的最实用方法。例如，我们可能让异步系统在后台运行，这样终端就不与程序绑定。我们可以通过向系统发送 `SIGHUP` 信号来关闭程序。要监听 `SIGHUP` 信号，我们需要以下导入：

```rust
use tokio::signal::unix::{signal, SignalKind};
```

然后我们可以替换主函数底部的 Ctrl-C 代码，如下所示：

```rust
let pid = std::process::id();
println!("此进程的 PID 是: {}", pid);
let mut stream = signal(SignalKind::hangup()).unwrap();
stream.recv().await;
let complete_counter = get_complete_count().await;
println!("完整计数器: {:?}", complete_counter);
```

我们打印出 PID，以便知道使用以下命令向哪个 PID 发送信号：

```bash
kill -SIGHUP <pid>
```

运行 kill 命令时，你应该得到与按 Ctrl-C 时类似的结果。现在我们可以说，你知道如何以运行时配置、任务运行和运行时关闭的方式来自定义 Tokio 了。

### 总结

在本章中，我们深入探讨了设置 Tokio 运行时的具体细节，以及其设置如何影响其运行方式。通过这些细节，我们真正控制了运行时的worker数量、阻塞线程数量以及在接受新任务轮询之前执行的 tick 次数。我们还探索了在同一程序中定义不同的运行时，这样我们可以选择将任务发送到哪个运行时。请记住，当 Tokio 运行时的线程不被使用时，它们会被停放，所以如果一个 Tokio 运行时没有被持续使用，我们不会浪费资源。

然后，我们使用本地池控制了线程处理任务的方式。我们甚至在 Tokio 运行时中测试了对线程状态的不安全访问，以证明在任务中访问线程状态是安全的。最后，我们介绍了优雅关闭。尽管我们不必编写自己的样板代码，但 Tokio 仍然为我们提供了非常灵活地配置运行时的能力。我们毫不怀疑，在你的异步 Rust 职业生涯中，你会遇到使用 Tokio 的代码库。你现在应该能够自如地在代码库中自定义 Tokio 运行时，并管理异步任务的处理方式。在第 8 章中，我们将以实现演员模型来解决异步问题，这种方式是模块化的。

## 第八章 参与者模型

*参与者*（Actors）是独立的代码片段，它们**仅通过消息传递进行通信**。参与者也可以拥有状态，它们可以引用和修改该状态。因为我们有异步兼容的非阻塞通道，所以我们的异步运行时可以同时处理多个参与者，仅当它们在自己的通道中收到消息时才推进这些参与者。

参与者的隔离使得异步测试变得简单，也简化了异步系统的实现。在本章结束时，你将能够构建一个具有路由器参与者的参与者系统。你构建的这个参与者系统可以轻松地在程序的任何地方被调用，而无需为了你的参与者系统到处传递引用。你还将能够构建一个监督者心跳系统，该系统将跟踪其他参与者，并在它们未能在时间阈值内 ping 通监督者时强制重启这些参与者。要开始这段旅程，你需要了解如何构建基本的参与者。

### 构建一个基本参与者

我们能构建的最基本的参与者是一个无限循环的异步函数，它监听消息：

```rust
use tokio::sync::{
    mpsc::channel,
    mpsc::{Receiver, Sender},
    oneshot
};

struct Message {
    value: i64
}

async fn basic_actor(mut rx: Receiver<Message>) {
    let mut state = 0;

    while let Some(msg) = rx.recv().await {
        state += msg.value;
        println!("Received: {}", msg.value);
        println!("State: {}", state);
    }
}
```

该参与者使用多生产者单消费者通道（`mpsc`）监听传入的消息，更新状态，然后将其打印出来。我们可以按如下方式测试我们的参与者：

```rust
#[tokio::main]
async fn main() {
    let (tx, rx) = channel::<Message>(100);

    let _actor_handle = tokio::spawn(
        basic_actor(rx)
    );
    for i in 0..10 {
        let msg = Message { value: i };
        tx.send(msg).await.unwrap();
    }
}
```

但是，如果我们想收到响应怎么办？现在，我们发送消息到虚无中，并查看终端中的打印输出。我们可以通过将 `oneshot::Sender` 打包到发送给参与者的消息中来促成响应。接收消息的参与者随后可以使用该 `oneshot::Sender` 来发送响应。我们可以用以下代码定义我们的响应参与者：

```rust
struct RespMessage {
    value: i32,
    responder: oneshot::Sender<i64>
}

async fn resp_actor(mut rx: Receiver<RespMessage>) {
    let mut state = 0;

    while let Some(msg) = rx.recv().await {
        state += msg.value;
        if msg.responder.send(state).is_err() {
            println!("Failed to send response");
        }
    }
}
```

如果我们想向我们的响应参与者发送消息，我们必须构造一个 `oneshot` 通道，用它来构造消息，发送消息，然后等待响应。以下代码描述了一个如何实现这一点的基本示例：

```rust
let (tx, rx) = channel::<RespMessage>(100);

let _resp_actor_handle = tokio::spawn(async {
    resp_actor(rx).await;
});
for i in 0..10 {
    let (resp_tx, resp_rx) = oneshot::channel::<i64>();
    let msg = RespMessage {
        value: i,
        responder: resp_tx
    };
    tx.send(msg).await.unwrap();
    println!("Response: {}", resp_rx.await.unwrap());
}
```

这里，我们使用 `oneshot` 通道，因为响应只需要发送一次，然后客户端代码就可以继续做其他事情。这是我们用例的最佳选择，因为 `oneshot` 通道在内存和同步方面针对仅发送一条消息然后关闭的用例进行了优化。

考虑到我们通过通道向参与者发送结构体，你可以看到我们的功能复杂性可以增加。例如，发送一个封装了多种消息的枚举可以指示参与者根据发送的消息类型执行一系列操作。参与者还可以创建新的参与者或向其他参与者发送消息。

从我们展示的示例来看，我们也可以直接使用互斥锁并在修改状态时获取它。互斥锁编写起来很简单，但它与参与者相比如何呢？

### 参与者与互斥锁的对比

为了这个练习，我们需要这些额外的导入：

```rust
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::sync::mpsc::error::TryRecvError;
```

要用互斥锁重现我们之前部分参与者的功能，我们有一个函数，其形式如下：

```rust
async fn actor_replacement(state: Arc<Mutex<i64>>, value: i64) -> i64 {
    let mut state = state.lock().await;
    *state += value;
    return *state
}
```

虽然这写起来很简单，但在性能方面表现如何？我们可以设计一个简单的测试：

```rust
let state = Arc::new(Mutex::new(0));
let mut handles = Vec::new();

let now = tokio::time::Instant::now();

for i in 0..100000000 {
    let state_ref = state.clone();
    let future = async move {
        let handle = tokio::spawn(async move {
            actor_replacement(state_ref, i).await
        });
        let _ = handle.await.unwrap();
    };
    handles.push(tokio::spawn(future));
}

for handle in handles {
    let _ = handle.await.unwrap();
}

println!("Elapsed: {:?}", now.elapsed());
```

我们一次性产生了大量任务，试图获取互斥锁，然后等待它们完成。如果我们一次只产生一个任务，我们将无法获得互斥锁的并发性对结果的真正影响。相反，我们只会得到单个事务的速度。我们运行大量任务是因为我们想看到不同方法之间在统计上显著的差异。

这些测试运行需要很长时间，但结果不会产生误解。在撰写本文时，在一台高规格的 M2 MacBook 上以 `--release` 模式运行代码，所有互斥锁任务完成所需的时间是 155 秒。

要用我们在上一节中的参与者运行相同的测试，我们需要以下代码：

```rust
let (tx, rx) = channel::<RespMessage>(100000000);
let _resp_actor_handle = tokio::spawn(async {
    resp_actor(rx).await;
});

let mut handles = Vec::new();

let now = tokio::time::Instant::now();
for i in 0..100000000 {
    let tx_ref = tx.clone();

    let future = async move {
        let (resp_tx, resp_rx) = oneshot::channel::<i64>();
        let msg = RespMessage {
            value: i,
            responder: resp_tx
        };
        tx_ref.send(msg).await.unwrap();
        let _ = resp_rx.await.unwrap();
    };
    handles.push(tokio::spawn(future));
}

for handle in handles {
    let _ = handle.await.unwrap();
}

println!("Elapsed: {:?}", now.elapsed());
```

在撰写本文时，运行此测试需要 103 秒。请注意，我们在 `--release` 模式下运行测试，以查看编译器优化对系统的影响。参与者快了 52 秒。一个原因是获取互斥锁的开销。将消息放入通道时，我们必须检查通道是否已满或已关闭。而获取互斥锁时，检查更为复杂。这些检查通常涉及检查锁是否被另一个任务持有。如果是，则尝试获取锁的任务需要注册兴趣并等待被通知。

通常，在并发环境中，通过通道传递消息比使用互斥锁扩展性更好，因为发送者不必等待其他任务完成它们正在做的事情。它们可能需要等待将消息放入通道队列，但等待消息放入队列比等待一个操作完成与互斥锁的操作、释放锁，然后等待任务获取锁要快。因此，通道可以实现更高的吞吐量。

为了进一步说明这一点，让我们探讨一个场景，其中事务比仅仅将值加一更复杂。也许在将最终结果提交到状态并返回数字之前，我们需要进行一些检查和计算。作为高效的工程师，我们可能希望在该过程发生时做其他事情。因为我们发送消息并等待响应，所以使用参与者代码时我们已经有这个便利，如下所示：

```rust
let future = async move {
    let (resp_tx, resp_rx) = oneshot::channel::<i32>();
    let msg = RespMessage {
        value: i,
        responder: resp_tx
    };
    tx_ref.send(msg).await.unwrap();
    // 做点别的事
    let _ = resp_rx.await.unwrap();
};
```

然而，我们的互斥锁实现只会将控制权交还给调度器。如果我们希望在等待复杂事务完成的同时推进我们的互斥锁任务，我们将不得不生成另一个异步任务，如下所示：

```rust
async fn actor_replacement(state: Arc<Mutex<i32>>, value: i32) -> i32 {
    let update_handle = tokio::spawn(async move {
        let mut state = state.lock().await;
        *state += value;
        return *state
    });
    // 做点别的事
    update_handle.await.unwrap()
}
```

然而，生成这些额外异步任务的开销使我们测试的运行时间增加到 174 秒。这比实现相同功能的参与者多了 73 秒。这并不奇怪，因为我们向运行时发送一个异步任务并取回一个句柄，只是为了允许我们在任务后面等待事务结果。

考虑到我们的测试结果，你可以明白为什么我们想使用参与者。参与者编写起来更复杂。你需要通过通道传递消息，并为参与者的响应打包一个 `oneshot` 通道，仅仅是为了获取结果。这比获取锁更复杂。然而，选择何时等待该消息结果的灵活性在参与者中是自然而然的。另一方面，如果希望获得这种灵活性，互斥锁会有很大的性能损失。

我们还可以认为参与者更容易概念化。如果我们思考一下，参与者包含它们的状态。如果你想查看与该状态的所有交互，你可以查看参与者代码。然而，对于使用互斥锁的代码库，我们不知道与状态的所有交互发生在哪里。与互斥锁的分布式交互也增加了它在整个系统中高度耦合的风险，使得重构变得头疼。

现在我们已经让参与者正常工作了，我们需要能够在系统中使用它们。将参与者以最小化影响集成到系统中的最简单方法是使用路由器模式。

### 实现路由器模式

对于我们的路由，我们构造一个路由器参与者，它接受消息。这些消息可以包装在枚举中，以帮助我们的路由器定位正确的参与者。对于我们的示例，我们将实现一个基本的键值存储。我们必须强调，虽然我们在 Rust 中构建键值存储，但你不应将此教学示例用于生产环境。像 RocksDB 和 Redis 这样成熟的解决方案已经投入了大量工作和专业知识来使它们的键值存储健壮且可扩展。

对于我们的键值存储，我们需要设置、获取和删除键。我们可以通过图 8-1 定义的消息布局来发出所有这些操作的信号。

**图 8-1. 路由器参与者消息的枚举结构**

在我们编写任何代码之前，我们需要以下导入：

```rust
use tokio::sync::{
    mpsc::channel,
    mpsc::{Receiver, Sender},
    oneshot,
};
use std::sync::OnceLock;
```

我们还需要定义图 8-1 中所示的消息布局：

```rust
struct SetKeyValueMessage {
    key: String,
    value: Vec<u8>,
    response: oneshot::Sender<()>,
}

struct GetKeyValueMessage {
    key: String,
    response: oneshot::Sender<Option<Vec<u8>>>,
}

struct DeleteKeyValueMessage {
    key: String,
    response: oneshot::Sender<()>,
}

enum KeyValueMessage {
    Get(GetKeyValueMessage),
    Delete(DeleteKeyValueMessage),
    Set(SetKeyValueMessage),
}

enum RoutingMessage {
    KeyValue(KeyValueMessage),
}
```

我们现在有一个可以路由到键值参与者的消息，并且该消息用执行操作所需的数据发出了正确操作的信号。对于我们的键值参与者，我们接受 `KeyValueMessage`，匹配其变体，并执行操作，如下所示：

```rust
async fn key_value_actor(mut receiver: Receiver<KeyValueMessage>) {
    let mut map = std::collections::HashMap::new();
    while let Some(message) = receiver.recv().await {
        match message {
            KeyValueMessage::Get(
                GetKeyValueMessage { key, response }
            ) => {
                let _ = response.send(map.get(&key).cloned());
            }
            KeyValueMessage::Delete(
                DeleteKeyValueMessage { key, response }
            ) => {
                map.remove(&key);
                let _ = response.send(());
            }
            KeyValueMessage::Set(
                SetKeyValueMessage { key, value, response }
            ) => {
                map.insert(key, value);
                let _ = response.send(());
            }
        }
    }
}
```

有了对键值消息的处理，我们需要将键值参与者与路由器参与者连接起来：

```rust
async fn router(mut receiver: Receiver<RoutingMessage>) {
    let (key_value_sender, key_value_receiver) = channel(32);
    tokio::spawn(key_value_actor(key_value_receiver));
    while let Some(message) = receiver.recv().await {
        match message {
            RoutingMessage::KeyValue(message) => {
                let _ = key_value_sender.send(message).await;
            }
        }
    }
}
```

我们在路由器参与者内部创建键值参与者。参与者可以创建其他参与者。将键值参与者的创建放在路由器参与者内部，确保了系统设置永远不会出错。它还减少了我们程序中参与者系统设置的复杂性。路由器是我们的接口，因此所有内容都将通过路由器到达其他参与者。

现在路由器已经定义好了，我们必须把注意力转向该路由器的通道。所有发送到我们参与者系统的消息都将通过该通道。我们任意选择了数字 32；这意味着该通道一次最多可以容纳 32 条消息。这个缓冲区大小给了我们一些灵活性。

如果我们必须跟踪对该通道发送者的引用，那么系统将不是很有用。如果一个开发者想向我们的参与者系统发送消息，而他们处于四层深度，想象一下如果不得不将他们正在使用的函数追溯回主函数，为通向他们正在工作的函数的每个函数打开一个用于通道发送者的参数，他们会感到多么沮丧。以后进行更改同样会令人沮丧。为了避免这种挫败感，我们将发送者定义为全局静态变量：

```rust
static ROUTER_SENDER: OnceLock<Sender<RoutingMessage>> = OnceLock::new();
```

当我们为路由器创建主通道时，我们将设置发送者。你可能想知道在路由器参与者函数内部构造主通道并设置 `ROUTER_SENDER` 是否更符合人体工程学。然而，如果在通道设置之前，函数试图向主通道发送消息，可能会出现一些并发问题。记住，异步运行时可以跨多个线程，所以有可能在路由器参与者尝试设置通道时，一个异步任务正试图调用该通道。因此，最好在主函数开始之前设置通道，然后再生成任何任务。这样，即使路由器参与者不是异步运行时上第一个被轮询的任务，它仍然可以访问在被轮询之前发送到通道的消息。

**注意全局静态变量的使用**

我们使用了一个带有 `OnceLock` 的全局变量（`ROUTER_SENDER`）来简化示例，并避免用额外的设置代码使本章显得杂乱。虽然这种方法保持代码简单明了，但重要的是要意识到在异步 Rust 代码中使用全局状态的潜在缺点：

*   **脆弱性**：全局状态可能导致难以追踪的错误，尤其是在大型或复杂的应用程序中。如果全局状态被意外修改，可能会导致意想不到的副作用。
*   **测试困难**：测试依赖于全局状态的代码可能更具挑战性。测试可能变得依赖于它们的运行顺序，或者可能相互干扰。
*   **资源管理**：使用全局状态时，资源（如发送者通道）的生命周期管理变得更加复杂。

为了防止这种情况，你可以在主函数开始时创建通道，并将 `Sender` 传递给参与者，然后参与者可以传递 `Sender` 给其他参与者，因为我们可以克隆 `Sender` 结构体，如下所示：

```rust
#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let (sender, receiver) = channel(32);
    tokio::spawn(router(receiver, sender.clone()));
    // ...
}
```

在本章中，由于我们需要跟踪很多活动部分，我们将省略这种全局变量的方法。

我们的路由器参与者现在准备好接收消息并将其路由到我们的键值存储。我们需要一些能够发送键值消息的函数。我们可以从我们的 `set` 函数开始，该函数由以下代码定义：

```rust
pub async fn set(key: String, value: Vec<u8>) -> Result<(), std::io::Error> {
    let (tx, rx) = oneshot::channel();
    ROUTER_SENDER.get().unwrap().send(
        RoutingMessage::KeyValue(KeyValueMessage::Set(
            SetKeyValueMessage {
                key,
                value,
                response: tx,
            }))).await.unwrap();
    rx.await.unwrap();
    Ok(())
}
```

这段代码有很多 `unwrap`，但如果由于通道错误导致我们的系统失败，那我们就有更大的问题了。这些 `unwrap` 仅仅是为了避免本章中的代码膨胀。我们将在第 170 页的“创建参与者监督”中介绍错误处理。我们可以看到，我们的路由消息是自解释的。我们知道它是一个路由消息，并且该消息被路由到键值参与者。然后我们知道我们在键值参与者中调用了哪个方法以及传入的数据。路由消息枚举提供了足够的信息来告诉我们消息的预定路由。

现在我们的 `set` 函数已经定义好了，你或许可以自己构建 `get` 函数。试一试。

希望你的 `get` 函数与下面的类似：

```rust
pub async fn get(key: String) -> Result<Option<Vec<u8>>, std::io::Error> {
    let (tx, rx) = oneshot::channel();
    ROUTER_SENDER.get().unwrap().send(
        RoutingMessage::KeyValue(KeyValueMessage::Get(
            GetKeyValueMessage {
                key,
                response: tx,
            }))).await.unwrap();
    Ok(rx.await.unwrap())
}
```

我们的 `delete` 函数与 `get` 几乎相同，除了不同的路由以及 `delete` 函数不返回任何内容：

```rust
pub async fn delete(key: String) -> Result<(), std::io::Error> {
    let (tx, rx) = oneshot::channel();
    ROUTER_SENDER.get().unwrap().send(
        RoutingMessage::KeyValue(KeyValueMessage::Delete(
            DeleteKeyValueMessage {
                key,
                response: tx,
            }))).await.unwrap();
    rx.await.unwrap();
    Ok(())
}
```

我们的系统已经准备好了。我们可以用主函数来测试我们的路由器和键值存储：

```rust
#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let (sender, receiver) = channel(32);
    ROUTER_SENDER.set(sender).unwrap();
    tokio::spawn(router(receiver));

    let _ = set("hello".to_owned(), b"world".to_vec()).await;
    let value = get("hello".to_owned()).await;
    println!("Value: {:?}", String::from_utf8(value.unwrap().unwrap()));
    let _ = delete("hello".to_owned()).await;
    let value = get("hello".to_owned()).await;
    println!("Value: {:?}", value);
    Ok(())
}
```

代码给出以下打印输出：

```
value: Ok("world")
value: None
```

我们的键值存储正常工作且可运行。然而，当我们的系统关闭或崩溃时会发生什么？我们需要一个能够跟踪状态并在重启系统时恢复它的参与者。

### 为参与者实现状态恢复

现在我们的系统有一个键值存储参与者。然而，我们的系统可能会停止并重新启动，或者参与者可能崩溃。如果发生这种情况，我们可能会丢失所有数据，这很糟糕。为了降低数据丢失的风险，我们将创建另一个参与者，将我们的数据写入文件。我们新系统的概要如图 8-2 所示。

**图 8-2. 一个写入者备份参与者系统**

从图 8-2 中，我们可以看到执行的步骤如下：

1.  向我们的参与者系统发出调用。
2.  路由器将消息发送给键值存储参与者。
3.  我们的键值存储参与者克隆该操作，并将该操作发送给写入者参与者。
4.  写入者参与者对其自己的映射执行该操作，并将映射写入数据文件。
5.  键值存储对其自己的映射执行该操作，并将结果返回给调用参与者系统的代码。

当我们的参与者系统启动时，我们将有以下顺序：

1.  我们的路由器参与者启动，创建我们的键值存储参与者。
2.  我们的键值存储参与者创建我们的写入者参与者。
3.  当我们的写入者参与者启动时，它从文件读取数据，填充自身，并将数据发送给键值存储参与者。

我们授予写入者参与者对数据文件的独占访问权。这将避免并发问题，因为写入者参与者一次只能处理一个事务，并且没有其他资源会修改文件。写入者对文件的独占性也可以为我们带来性能提升，因为写入者参与者可以在其整个生命周期内保持数据文件的文件句柄打开，而不是为每次写入打开文件。这大大减少了向操作系统请求权限和检查文件可用性的调用次数。

对于这个系统，我们需要更新键值参与者的初始化代码。我们还需要构建写入者参与者，并为写入者参与者添加一个新的消息，该消息可以从键值消息构造。

在编写任何新代码之前，我们需要以下导入：

```rust
use serde_json;
use tokio::fs::File;
use tokio::io::{
    self,
    AsyncReadExt,
    AsyncWriteExt,
    AsyncSeekExt
};
use std::collections::HashMap;
```

对于我们的写入者消息，我们需要写入者设置和删除值。然而，我们还需要写入者返回从文件读取的完整状态，这给了我们以下定义：

```rust
enum WriterLogMessage {
    Set(String, Vec<u8>),
    Delete(String),
    Get(oneshot::Sender<HashMap<String, Vec<u8>>>),
}
```

我们需要从键值消息构造此消息而不消耗它：

```rust
impl WriterLogMessage {
    fn from_key_value_message(message: &KeyValueMessage)
        -> Option<WriterLogMessage> {
        match message {
            KeyValueMessage::Get(_) => None,
            KeyValueMessage::Delete(message) => Some(
                WriterLogMessage::Delete(message.key.clone())
            ),
            KeyValueMessage::Set(message) => Some(
                WriterLogMessage::Set(
                    message.key.clone(),
                    message.value.clone())
            )
        }
    }
}
```

我们的消息定义现在已经完成。在编写写入者参与者之前，我们只需要再一个功能：状态的加载。我们需要两个参与者在启动时加载状态，因此我们的文件加载由以下独立函数定义：

```rust
async fn read_data_from_file(file_path: &str)
    -> io::Result<HashMap<String, Vec<u8>>> {
    let mut file = File::open(file_path).await;
    let mut contents = String::new();
    file.read_to_string(&mut contents).await;
    let data: HashMap<String, Vec<u8>> = serde_json::from_str(
        &contents
    );
    Ok(data)
}
```

虽然这可以工作，但我们需要状态的加载具有容错性。在参与者关闭之前恢复其状态是好的，但如果参与者因为无法从丢失或损坏的状态文件加载而根本无法运行，那么我们的系统就不会很好。因此，我们将加载包装在一个函数中，如果在加载状态时出现问题，该函数将返回一个空哈希映射：

```rust
async fn load_map(file_path: &str) -> HashMap<String, Vec<u8>> {
    match read_data_from_file(file_path).await {
        Ok(data) => {
            println!("Data loaded from file: {:?}", data);
            return data
        },
        Err(e) => {
            println!("Failed to read from file: {:?}", e);
            println!("Starting with an empty hashmap.");
            return HashMap::new()
        }
    }
}
```

我们打印出来，以便在未获得预期结果时检查系统的日志。

我们现在准备构建我们的写入者参与者。我们的写入者参与者需要从文件加载数据，然后监听传入的消息：

```rust
async fn writer_actor(mut receiver: Receiver<WriterLogMessage>)
    -> io::Result<()> {
    let mut map = load_map("./data.json").await;
    let mut file = File::create("./data.json").await.unwrap();

    while let Some(message) = receiver.recv().await {
        // ...
        let contents = serde_json::to_string(&map).unwrap();
        file.set_len(0).await;
        file.seek(std::io::SeekFrom::Start(0)).await;
        file.write_all(contents.as_bytes()).await;
        file.flush().await;
    }
    Ok(())
}
```

你可以看到，我们在每个消息周期之间清空文件并写入整个映射。这不是一种有效的写入文件方式。然而，本章的重点是参与者以及如何使用它们。关于将事务写入文件的权衡是一个涉及各种文件类型、批量写入和用于清理数据的垃圾回收的大主题。如果你对此感兴趣，Alex Petrov 的《数据库内幕》（Database Internals）提供了关于将事务写入文件的全面介绍。

在写入者参与者的消息匹配中，我们插入、移除或克隆然后返回整个映射：

```rust
match message {
    WriterLogMessage::Set(key, value) => {
        map.insert(key, value);
    }
    WriterLogMessage::Delete(key) => {
        map.remove(&key);
    },
    WriterLogMessage::Get(response) => {
        let _ = response.send(map.clone());
    }
}
```

虽然我们的路由器参与者保持不变，但我们的键值参与者需要在做任何其他事情之前创建写入者参与者：

```rust
let (writer_key_value_sender, writer_key_value_receiver) = channel(32);
tokio::spawn(writer_actor(writer_key_value_receiver));
```

我们的键值参与者然后需要从写入者参与者获取映射的状态：

```rust
let (get_sender, get_receiver) = oneshot::channel();
let _ = writer_key_value_sender.send(WriterLogMessage::Get(
    get_sender
)).await;
let mut map = get_receiver.await.unwrap();
```

最后，键值参与者可以构造一个写入者消息，并将其发送给写入者参与者，然后再处理事务本身：

```rust
while let Some(message) = receiver.recv().await {
    if let Some(
        write_message
    ) = WriterLogMessage::from_key_value_message(
        &message) {
        let _ = writer_key_value_sender.send(
            write_message
        ).await;
    }
    match message {
        // ...
    }
}
```

有了这些，我们的系统支持从文件写入和加载，而所有的键值事务都在内存中处理。如果你在主函数中操作你的代码，注释掉一些部分并检查 `data.json` 文件，你会发现它是有效的。然而，如果你的系统运行在像服务器这样的设备上，你可能不会手动监控文件以了解情况。现在我们的参与者系统变得更加复杂，写入者参与者可能已经崩溃且未运行，但我们对此一无所知，因为键值参与者可能仍在运行。这就是监督发挥作用的地方，因为我们需要跟踪参与者的状态。

### 创建参与者监督

现在我们有两个参与者：写入者和键值存储参与者。在本节中，我们将构建一个监督者参与者，跟踪系统中的每个参与者。我们将庆幸我们实现了路由器模式。创建一个监督者参与者，然后将监督者参与者通道的发送者传递给每个参与者将是一件令人头疼的事。相反，我们可以通过路由器向监督者参与者发送更新消息，因为每个参与者都可以直接访问 `ROUTER_SENDER`。监督者也可以通过路由器向正确的参与者发送重置请求，如图 8-3 所示。

你可以看到在图 8-3 中，如果我们没有从键值参与者或写入者参与者收到更新，我们可以重置键值参与者。因为当键值参与者创建写入者参与者时，我们可以让键值参与者持有写入者参与者的句柄，所以如果键值参与者死亡，写入者参与者也会死亡。当键值参与者重新创建时，写入者参与者也将被创建。

为了实现这个心跳监督者机制，我们必须稍微重构一下我们的参与者，但这将说明一点复杂性的权衡如何使我们能够跟踪和管理长时间运行的参与者。然而，在我们编写任何代码之前，我们需要以下导入来处理参与者的时间检查：

```rust
use tokio::time::{self, Duration, Instant};
```

我们还需要支持参与者的重置和心跳注册。因此，我们必须扩展我们的 `RoutingMessage`：

```rust
enum RoutingMessage {
    KeyValue(KeyValueMessage),
    Heartbeat(ActorType),
    Reset(ActorType),
}

#[derive(Clone, Copy, PartialEq, Eq, Hash, Debug)]
enum ActorType {
    KeyValue,
    Writer
}
```

在这里，我们可以请求重置或注册任何我们想在 `ActorType` 枚举中声明的参与者的心跳。

我们的第一次重构可以是键值参与者。首先，我们为写入者参与者定义一个句柄：

```rust
let (writer_key_value_sender, writer_key_value_receiver) = channel(32);
let _writer_handle = tokio::spawn(
    writer_actor(writer_key_value_receiver)
);
```

我们仍然向写入者参与者发送一个 `Get` 消息来填充映射，但随后我们将消息处理代码提升到一个无限循环中，以便实现超时：

```rust
let timeout_duration = Duration::from_millis(200);
let router_sender = ROUTER_SENDER.get().unwrap().clone();

loop {
    match time::timeout(timeout_duration, receiver.recv()).await {
        Ok(Some(message)) => {
            if let Some(
                write_message
            ) = WriterLogMessage::from_key_value_message(&message) {
                let _ = writer_key_value_sender.send(
                    write_message
                ).await;
            }
            match message {
                // ...
            }
        },
        Ok(None) => break,
        Err(_) => {
            router_sender.send(
                RoutingMessage::Heartbeat(ActorType::KeyValue)
            ).await.unwrap();
        }
    };
}
```

在循环结束时，我们向路由器发送一个心跳消息，表示我们的键值存储仍然存活。我们还有一个超时，所以如果 200 毫秒过去了，我们仍然运行一个循环，因为我们不希望缺乏传入消息成为监督者认为我们的参与者死亡或卡住的原因。

我们的写入者参与者也需要类似的方法。我们鼓励你尝试自己编写这段代码。希望你的尝试与以下代码类似：

```rust
let timeout_duration = Duration::from_millis(200);
let router_sender = ROUTER_SENDER.get().unwrap().clone();

loop {
    match time::timeout(timeout_duration, receiver.recv()).await {
        Ok(Some(message)) => {
            match message {
                // ...
            }
            let contents = serde_json::to_string(&map).unwrap();
            file.set_len(0).await;
            file.seek(std::io::SeekFrom::Start(0)).await;
            file.write_all(contents.as_bytes()).await;
            file.flush().await;
        },
        Ok(None) => break,
        Err(_) => {
            router_sender.send(
                RoutingMessage::Heartbeat(ActorType::Writer)
            ).await.unwrap();
        }
    };
}
```

我们的参与者现在支持向路由器发送心跳，供监督者跟踪。接下来我们需要构建我们的监督者参与者。我们的监督者参与者的方法与其余参与者类似。它有一个包含超时的无限循环，因为缺乏心跳消息不应该阻止监督者参与者检查它跟踪的参与者的状态。事实上，缺乏心跳消息可能表明系统需要检查。然而，在无限循环周期结束时，监督者参与者不是发送消息，而是遍历自己的状态以检查是否有任何参与者尚未签到。如果参与者已过时，监督者参与者会向路由器发送重置请求。这个过程的大纲在以下代码中给出：

```rust
async fn heartbeat_actor(mut receiver: Receiver<ActorType>) {
    let mut map = HashMap::new();
    let timeout_duration = Duration::from_millis(200);
    loop {
        match time::timeout(timeout_duration, receiver.recv()).await {
            Ok(Some(actor_name)) => map.insert(
                actor_name, Instant::now()
            ),
            Ok(None) => break,
            Err(_) => {
                continue;
            }
        };
        let half_second_ago = Instant::now() - Duration::from_millis(500);
        for (key, &value) in map.iter() {
            // ...
        }
    }
}
```

我们决定将截止时间设置为半秒。截止时间越小，参与者失败后重启的速度就越快。然而，这增加了工作量，因为参与者等待消息的超时时间也必须更小，以满足监督者的要求。

当我们遍历状态键以检查参与者时，如果超过截止时间，我们会发送重置请求：

```rust
if value < half_second_ago {
    match key {
        ActorType::KeyValue | ActorType::Writer =>
        {
            ROUTER_SENDER.get().unwrap().send(
                RoutingMessage::Reset(ActorType::KeyValue)
            ).await.unwrap();
            map.remove(&ActorType::KeyValue);
            map.remove(&ActorType::Writer);
            break;
        }
    }
}
```

你可能注意到，即使写入者参与者失败，我们也会重置键值参与者。这是因为键值参与者将重新启动写入者参与者。我们还从映射中移除键，因为当键值参与者再次启动时，它会发送心跳消息，导致这些键再次被检查。然而，写入者键可能仍然过时，导致第二次不必要的触发。我们可以在它们再次注册后开始检查那些参与者。

我们的路由器参与者现在必须支持我们所有的更改。首先，我们需要将键值通道和句柄设置为可变：

```rust
let (mut key_value_sender, mut key_value_receiver) = channel(32);
let mut key_value_handle = tokio::spawn(
    key_value_actor(key_value_receiver)
);
```

这是因为如果键值参与者被重置，我们需要重新分配新的句柄和通道。然后我们生成心跳参与者来监督我们的其他参与者：

```rust
let (heartbeat_sender, heartbeat_receiver) = channel(32);
tokio::spawn(heartbeat_actor(heartbeat_receiver));
```

现在我们的参与者系统正在运行，我们的路由器参与者可以处理传入的消息：

```rust
while let Some(message) = receiver.recv().await {
    match message {
        RoutingMessage::KeyValue(message) => {
            let _ = key_value_sender.send(message).await;
        },
        RoutingMessage::Heartbeat(message) => {
            let _ = heartbeat_sender.send(message).await;
        },
        RoutingMessage::Reset(message) => {
            // ...
        }
    }
}
```

对于我们的重置，我们必须执行几个步骤。首先，我们创建一个新通道。我们中止键值参与者，将发送者和接收者重新分配到新通道，然后生成一个新的键值参与者：

```rust
match message {
    ActorType::KeyValue | ActorType::Writer => {
        let (new_key_value_sender, new_key_value_receiver) = channel(
            32
        );
        key_value_handle.abort();
        key_value_sender = new_key_value_sender;
        key_value_receiver = new_key_value_receiver;
        key_value_handle = tokio::spawn(
            key_value_actor(key_value_receiver)
        );
        time::sleep(Duration::from_millis(100)).await;
    },
}
```

你可以看到我们有一个短暂的睡眠，以确保任务已经生成并在异步运行时上运行。你可能担心在此转换期间可能会向键值参与者发送更多请求，这可能会出错。然而，所有请求都通过路由器参与者。如果这些消息被发送到路由器用于键值参与者，它们只会排队在路由器的通道中。由此可见，参与者系统是非常容错的。

由于这段代码有很多活动部分，让我们用主函数一起运行所有代码：

```rust
// 在运行以下代码之前，请确保你的 data.json 文件有一组空的大括号，如下所示：
// {}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let (sender, receiver) = channel(32);
    ROUTER_SENDER.set(sender).unwrap();
    tokio::spawn(router(receiver));

    let _ = set("hello".to_string(), b"world".to_vec()).await;
    let value = get("hello".to_string()).await;
    println!("value: {:?}", value);
    let value = get("hello".to_string()).await;
    println!("value: {:?}", value);

    ROUTER_SENDER.get().unwrap().send(
        RoutingMessage::Reset(ActorType::KeyValue)
    ).await.unwrap();

    let value = get("hello".to_string()).await;
    println!("value: {:?}", value);
    let _ = set("test".to_string(), b"world".to_vec()).await;
    std::thread::sleep(std::time::Duration::from_secs(1));
    Ok(())
}
```

运行我们的主函数会得到以下打印输出：

```
Data loaded from file: []
value: Some([119, 111, 114, 108, 100])
value: Some([119, 111, 114, 108, 100])
Data loaded from file: {"hello": [119, 111, 114, 108, 100]}
value: Some([119, 111, 114, 108, 100])
```

我们可以看到，在设置系统时，写入者参与者最初加载了数据。在设置了 `hello` 值之后，我们的 `get` 函数正常工作。然后我们手动强制重置。在这里，我们可以看到数据再次被加载，这意味着写入者参与者正在重新启动。我们知道之前的写入者参与者已经死亡，因为写入者参与者获取文件句柄并一直持有它。我们会得到一个错误，因为文件描述符已经被持有。

如果你晚上想睡个好觉，可以在写入者参与者循环前添加一个时间戳，并在每次循环迭代开始时打印出时间戳，这样时间戳的打印就不依赖于任何传入的消息。这将给出如下打印输出：

```
Data loaded from file: []
writer instance: Instant { tv_sec: 1627237, tv_nsec: 669830291 }
value: Some([119, 111, 114, 108, 100])
writer instance: Instant { tv_sec: 1627237, tv_nsec: 669830291 }
value: Some([119, 111, 114, 108, 100])
Starting key_value_actor
writer instance: Instant { tv_sec: 1627237, tv_nsec: 669830291 }
Data loaded from file: {"hello": [119, 111, 114, 108, 100]}
writer instance: Instant { tv_sec: 1627237, tv_nsec: 773026500 }
value: Some([119, 111, 114, 108, 100])
writer instance: Instant { tv_sec: 1627237, tv_nsec: 773026500 }
writer instance: Instant { tv_sec: 1627237, tv_nsec: 773026500 }
writer instance: Instant { tv_sec: 1627237, tv_nsec: 773026500 }
writer instance: Instant { tv_sec: 1627237, tv_nsec: 773026500 }
writer instance: Instant { tv_sec: 1627237, tv_nsec: 773026500 }
writer instance: Instant { tv_sec: 1627237, tv_nsec: 773026500 }
```

我们可以看到重置前后的实例是不同的，并且重置后现有写入者实例的踪迹消失了。我们可以安心睡觉，知道我们的重置工作正常，并且没有孤独的参与者在我们的系统中漫无目的（我们指的是我们的系统——我们无法保证好莱坞的情况）。

### 总结

在本章中，我们构建了一个系统，它接受键值事务，通过写入者参与者备份它们，并通过心跳机制进行监控。即使这个系统有很多活动部分，但通过路由器模式简化了实现。路由器模式不如直接调用参与者高效，因为消息在到达目的地之前必须经过一个参与者。然而，路由器模式是一个极好的起点。当找出解决问题所需的参与者时，你可以依赖路由器模式。一旦解决方案形成，你可以转向参与者直接互相调用，而不是通过路由器参与者。

虽然我们专注于使用参与者构建整个系统，但我们必须记住，它们运行在异步运行时上。因为参与者是隔离的，并且由于它们仅通过消息通信而易于测试，我们可以采用与参与者混合的方法。这意味着我们可以使用参与者向正常的异步系统添加额外的功能。参与者通道可以在任何地方被访问。就像从路由器参与者迁移到参与者直接互相调用一样，当新的异步功能整体形式形成时，你可以慢慢地将新的异步代码从参与者迁移到标准的异步代码。你还可以使用参与者在遗留代码中分离功能，以隔离依赖关系，从而将遗留代码放入测试框架中。

总的来说，由于其隔离性，参与者是一个可以在各种环境中实现的有用工具。当你在发现阶段时，参与者也可以充当代码的“过渡区”。我们俩都在紧迫的期限内需要提出解决方案时求助于参与者，例如在微服务集群中缓存和缓冲聊天机器人消息。

在第 9 章中，我们将继续探索如何通过介绍设计模式来接近和构建解决方案。

## 第九章 设计模式  

在本书中，我们已经涵盖了各种异步概念以及如何以多种方式实现异步代码来解决问题。然而，我们知道软件工程并非存在于真空中。当你在实际环境中应用你新获得的异步编程知识时，你将无法在完美的环境中应用孤立的异步代码。你可能需要将异步代码应用到一个原本不是异步的现有代码库中。你可能需要与像服务器这样的第三方服务交互，这时你需要处理服务器响应的变化。在本章中，我们将介绍在解决各种问题时帮助你实现异步代码的设计模式。

通过本章的学习，你将能够在以前不支持异步编程的现有代码库中实现异步代码。你还将能够实现瀑布设计模式，以构建具有可重用异步组件的路径。你将能够在不修改异步任务代码的情况下，通过实现装饰器模式来轻松添加额外功能（如日志记录），只需在运行或构建程序时添加编译标志即可。最后，你还将能够让整个异步系统通过实现重试和电路熔断器模式来适应错误。

首先，在实现设计模式之前，我们需要能够在系统中实现异步代码。因此，我们应该从构建一个隔离的模块开始。

### 构建隔离的模块

让我们假设我们有一个没有任何异步代码的 Rust 代码库，并且我们希望将一些异步 Rust 集成到这个现有的代码库中。与其重写整个代码库来融入异步 Rust，我们建议保持交互的影响范围尽量小。大规模的重写很少能按时完成，并且随着重写的延迟，更多功能被添加到现有代码库中，这会威胁到重写的完成。因此，我们可以从小处着手，将我们的异步代码写在它自己的模块中，然后提供同步的入口点。这些同步入口点使我们的异步模块能够集成到现有代码库的任何地方。同步入口点还使其他开发人员能够使用我们的异步模块，而无需学习异步编程。这简化了集成过程，其他开发人员可以按照自己的节奏逐步理解异步编程。

但是，我们如何通过同步入口点提供异步编程的好处呢？图9-1描述了为非异步代码库提供异步好处的高层流程。

**图9-1. 我们隔离异步模块的概述**

如图9-1所示，我们发送一个异步任务到运行时，将该任务的句柄放入一个映射表中，并返回一个与该映射表中句柄对应的键。使用该模块的开发人员调用一个普通的阻塞函数，并收到一个唯一的 ID。该任务在异步运行时中执行，开发人员可以继续编写一些同步代码。当开发人员需要结果时，他们通过 `get_add` 函数传入唯一的 ID，该函数将阻塞同步代码，直到产生结果。开发人员将唯一 ID 视为一个异步句柄，但不必直接与任何异步代码交互。在我们实现这种方法之前，我们需要以下依赖项：

```toml
tokio = { version = "1.33.0", features = ["full"] }
uuid = { version = "1.5.0", features = ["v4"] }
```

有了这些依赖项，我们可以在 `main.rs` 旁边创建我们的 `async_mod.rs` 文件。我们的 `async_mod.rs` 文件将包含我们的异步模块代码。在这个文件中，我们需要这些导入：

```rust
use std::sync::LazyLock;
use tokio::runtime::{Runtime, Builder};
use tokio::task::JoinHandle;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

pub type AddFutMap = LazyLock<Arc<Mutex<HashMap<String, JoinHandle<i32>>>>>;
```

对于我们的运行时，我们将使用以下内容：

```rust
static TOKIO_RUNTIME: LazyLock<Runtime> = LazyLock::new(|| {
    Builder::new_multi_thread()
        .enable_all()
        .build()
        .expect("Failed to create Tokio runtime")
});
```

我们定义了一个包含睡眠操作（代表异步任务）的简单 `async_add` 函数：

```rust
async fn async_add(a: i32, b: i32) -> i32 {
    println!("starting async_add");
    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
    println!("finished async_add");
    a + b
}
```

这是我们将暴露给异步运行时但不暴露给模块外部的核心异步任务，这就是为什么运行时和 `async_add` 函数不是公开的。

现在我们已经定义了异步运行时和 `async_add` 任务，我们可以构建我们的处理程序。如图9-2所示，我们的处理程序本质上是入口点与运行时和映射表交互的路由器。

**图9-2. 与我们的异步句柄映射表的链接**

我们的处理程序需要是一个函数，它接收要相加的数字或用于获取结果的唯一 ID：

```rust
fn add_handler(a: Option<i32>, b: Option<i32>, id: Option<String>)
    -> Result<(Option<i32>, Option<String>), String> {
    static MAP: AddFutMap = LazyLock::new(|| Arc::new(
        Mutex::new(HashMap::new())
    ));
    match (a, b, id) {
        (Some(a), Some(b), None) => {
            // ...
        },
        (None, None, Some(id)) => {
            // ...
        },
        _ => Err(
            "either a or b need to be provided or a handle_id".to_string()
        )
    }
}
```

对于我们的示例，`add_handler` 函数的 `Option<i32>` 输入是可行的，因为用户不会直接与之交互。然而，如果你计划让 `add_handler` 支持更多操作，如减法或乘法，最好向 `add_handler` 函数传入一个枚举：

```rust
enum Operation {
    Add { a: i32, b: i32 },
    Multiply { a: i32, b: i32 },
    Subtract { a: i32, b: i32 },
}

fn perform_operation(op: Operation) -> i32 {
    match op {
        Operation::Add { a, b } => a + b,
        Operation::Multiply { a, b } => a * b,
        Operation::Subtract { a, b } => a - b,
    }
}
```

我们的期物映射表是惰性求值的，就像在第 3 章中我们在 `spawn_task` 函数中将队列定义为惰性求值一样。如果我们调用处理程序函数并更新了 `MAP`，下次我们调用处理程序时，处理程序函数内部将拥有更新后的 `MAP`。尽管我们只打算在主线程的同步代码中调用处理程序函数，但我们不能保证其他开发人员不会创建一个线程并调用此函数。

如果你 100% 确定处理程序只在主线程中被调用，你可以去掉 `Arc` 和 `Mutex`，使 `MAP` 可变，并使用不安全代码在函数的其余部分访问 `MAP`。然而，正如你可能猜到的，这是不安全的。你也可以使用 `thread_local` 来去掉 `Arc` 和 `Mutex`。只要开发人员在启动任务的同一线程中获取结果，这可以是安全的。开发人员不需要访问程序的整个映射表。开发人员只需要访问保存其任务异步句柄的映射表。

在我们处理程序函数的第一个匹配分支中，我们提供了要相加的数字，因此我们生成一个任务，将其与 `MAP` 中的唯一 ID 绑定，并返回该唯一 ID：

```rust
let handle = TOKIO_RUNTIME.spawn(async_add(a, b));
let id = uuid::Uuid::new_v4().to_string();
MAP.lock().unwrap().insert(id.clone(), handle);
Ok((None, Some(id)))
```

现在我们可以定义处理用于获取任务结果的唯一 ID 的分支。在这里，我们从 `MAP` 中获取任务句柄，将句柄传入异步运行时以阻塞当前线程直到产生结果，然后返回结果：

```rust
let handle = match MAP.lock().unwrap().remove(&id) {
    Some(handle) => handle,
    None => return Err("No handle found".to_string())
};
let result: i32 = match TOKIO_RUNTIME.block_on(async {
    handle.await
}) {
    Ok(result) => result,
    Err(e) => return Err(e.to_string())
};
Ok((Some(result), None))
```

我们的处理程序现在可以工作了。但是，请注意我们的处理程序不是公开的。这是因为接口不够方便。使用我们模块的开发人员可能会传入错误的输入组合。我们可以从第一个公共接口开始：

```rust
pub fn send_add(a: i32, b: i32) -> Result<String, String> {
    match add_handler(Some(a), Some(b), None) {
        Ok((None, Some(id))) => Ok(id),
        Ok(_) => Err(
            "Something went wrong, please contact author".to_string()
        ),
        Err(e) => Err(e)
    }
}
```

我们要求开发人员必须提供两个整数，这两个整数会传递给我们的处理程序。然后我们返回 ID。但是，如果我们返回任何不是错误的变体，那么我们的实现就出了严重问题。为了帮助使用我们模块的开发人员节省调试时间，我们告诉他们联系我们，因为这是我们自己的问题。

获取结果的接口与我们的发送接口类似，只是方向相反，采用以下形式：

```rust
pub fn get_add(id: String) -> Result<i32, String> {
    match add_handler(None, None, Some(id)) {
        Ok((Some(result), None)) => Ok(result),
        Ok(_) => Err(
            "Something went wrong, please contact author".to_string()
        ),
        Err(e) => Err(e)
    }
}
```

现在我们的异步模块已经完成，我们可以在 `main.rs` 中使用它：

```rust
mod async_mod;

fn main() {
    println!("Hello, world!");
    let id = async_mod::send_add(1, 2).unwrap();
    println!("id: {}", id);
    std::thread::sleep(std::time::Duration::from_secs(4));
    println!("main sleep done");
    let result = async_mod::get_add(id).unwrap();
    println!("result: {}", result);
}
```

运行代码会得到类似以下的输出：

```
Hello, world!
starting async_add
id: e2a2f3e1-2a77-432c-b0b8-923483ae637f
finished async_add
main sleep done
result: 3
```

你的 ID 会不同，但顺序应该相同。在这里，我们可以看到异步任务在我们的主线程继续执行时正在被处理，并且我们可以获取结果。我们可以看到我们的异步代码是多么隔离。我们现在可以自由地进行实验。例如，你将能够尝试不同的运行时和运行时配置。回想一下第 7 章，如果我们的计算需求增加，我们可以切换到本地集合并开始使用本地线程状态来缓存最近计算的值。然而，我们的接口与异步原语完全解耦，因此使用我们模块的其他开发人员不会注意到差异，因此他们对接口的实现也不会被破坏。

现在我们已经介绍了如何以对代码库其余部分影响最小的方式实现异步模块，我们可以在我们的代码库中实现其他设计模式。我们可以从瀑布设计模式开始。

### 瀑布设计模式

瀑布设计模式（也称为责任链模式）是一系列直接将值传递给彼此的异步任务的链，如图9-3所示。

**图9-3. 瀑布异步设计模式**

实现一个基本的瀑布设计模式很简单。使用 Rust，我们可以利用错误处理系统来编写安全且简洁的代码。我们可以用以下三个异步任务来演示：

```rust
type WaterFallResult = Result<String, Box<dyn std::error::Error>>;

async fn task1() -> WaterFallResult {
    Ok("Task 1 completed".to_string())
}
async fn task2(input: String) -> WaterFallResult {
    Ok(format!("{} then Task 2 completed", input))
}
async fn task3(input: String) -> WaterFallResult {
    Ok(format!("{} and finally Task 3 completed", input))
}
```

由于它们都返回相同的错误类型，它们都可以通过 `?` 运算符链接在一起：

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let output1 = task1().await?;
    let output2 = task2(output1).await?;
    let result = task3(output2).await?;
    println!("{}", result);
    Ok(())
}
```

瀑布方法简单且可预测。它还使我们能够重用异步任务作为构建模块。例如，我们的三个异步任务可以接受 `i32` 数据类型。我们可以在这些异步任务周围添加逻辑，如下所示：

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let output1 = task1().await?;
    let output2: i32;
    if output1 > 10 {
        output2 = task2(output1).await?;
    } else {
        output2 = task3(output1).await?;
    }
    println!("{}", output2);
    Ok(())
}
```

考虑到我们可以使用逻辑来引导瀑布的流向，我们可以看到瀑布实现可能对构建略有不同但使用相同核心组件的路径很有用。我们还可以根据需要轻松地在这些工作流的组件之间插入指标/日志记录。虽然在这些组件之间插入指标/日志记录很有用，但我们也可以使用装饰器模式为任务添加功能。

### 装饰器模式

**装饰器模式**是围绕功能的包装器，它要么增加该功能，要么在主执行之前或之后执行逻辑。装饰器的经典例子是夹具：单元测试在测试前设置某些数据存储的状态，然后在测试后销毁该状态。测试之间的状态设置和销毁确保测试是原子的，并且失败的测试不会改变其他测试的结果。这种状态管理可以包装在我们正在测试的代码周围。日志记录也是一个经典用途，因为我们可以轻松地关闭日志记录，而无需更改核心逻辑。装饰器也用于会话管理。

在我们看在异步上下文中实现装饰器模式之前，让我们看看如何为结构体实现一个基本的装饰器。我们的装饰器将向一个字符串添加内容。我们将要装饰的功能将产生一个字符串，代码如下：

```rust
trait Greeting {
    fn greet(&self) -> String;
}
```

然后我们定义一个实现我们 trait 的结构体：

```rust
struct HelloWorld;
impl Greeting for HelloWorld {
    fn greet(&self) -> String {
        "Hello, World!".to_string()
    }
}
```

我们可以定义一个装饰器结构体，它实现我们的 trait，并且它包含一个同样体现我们 trait 的内部组件：

```rust
struct ExcitedGreeting<T> {
    inner: T,
}

impl<T> ExcitedGreeting<T> {
    fn greet(&self) -> String
    where
        T: Greeting,
    {
        let mut greeting = self.inner.greet();
        greeting.push_str(" I'm so excited to be in Rust!");
        greeting
    }
}
```

在这里，我们调用内部结构体的 trait 并向字符串添加内容，返回修改后的字符串。我们可以轻松地测试装饰器模式：

```rust
fn main() {
    let raw_one = HelloWorld;
    let raw_two = HelloWorld;
    let decorated = ExcitedGreeting { inner: raw_two };
    println!("{}", raw_one.greet());
    println!("{}", decorated.greet());
}
```

我们可以轻松地在结构体周围包装功能。因为我们为包装器实现了相同的 trait，所以我们也可以将包装后的结构体传递给需要实现了我们 trait 的结构体的函数。因此，如果我们期望的是 trait 而不是结构体，我们就不需要改变代码库中的任何代码。

我们甚至可以使装饰器模式的实现依赖于编译特性。例如，我们可以在 `Cargo.toml` 中添加一个特性：

```toml
[features]
logging_decorator = []
```

然后，我们可以根据特性标志重写 `main` 函数，以编译带装饰逻辑（或不带）的代码：

```rust
fn main() {
    #[cfg(feature = "logging_decorator")]
    let hello = ExcitedGreeting { inner: HelloWorld };

    #[cfg(not(feature = "logging_decorator"))]
    let hello = HelloWorld;

    println!("{}", hello.greet());
}
```

要运行我们的装饰器，我们需要在终端调用以下命令：

```bash
cargo run --features "logging_decorator"
```

如果需要，我们可以将此特性设置为默认值，如果它依赖任何依赖项，也可以向该特性添加额外的依赖项。

现在你理解了装饰器的基本原理，我们可以在一个期物中实现相同的功能。不再是结构体，我们有一个内部期物。在构建期物之前，我们需要这些导入：

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};
```

对于这个装饰器，我们将实现一个日志记录 trait，我们的示例将在轮询内部期物之前调用日志函数。我们的日志记录 trait 采用以下形式：

```rust
trait Logging {
    fn log(&self);
}
```

然后我们定义包含内部期物的日志记录结构体：

```rust
struct LoggingFuture<F: Future + Logging> {
    inner: F,
}

impl<F: Future + Logging> Future for LoggingFuture<F> {
    type Output = F::Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output>
    {
        let inner = unsafe { self.map_unchecked_mut(|s| &mut s.inner) };
        inner.log();
        inner.poll(cx)
    }
}
```

虽然我们在 `poll` 中使用了不安全代码，但我们的代码是安全的。我们必须使用不安全块，因为 Rust 编译器无法检查 pin 的投影。我们并没有将值移出 pin。

虽然不安全块是安全的，但我们可以通过以下代码固定我们的内部期物来避免不安全标记：

```rust
struct LoggingFuture<F: Future + Logging> {
    inner: Pin<Box<F>>,
}

impl<F: Future + Logging> Future for LoggingFuture<F> {
    type Output = F::Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output>
    {
        let this = self.get_mut();
        let inner = this.inner.as_mut();
        inner.log();
        inner.poll(cx)
    }
}
```

现在我们需要为任何也实现期物的类型实现 `Logging` trait：

```rust
impl<F: Future> Logging for F {
    fn log(&self) {
        println!("Polling the future!");
    }
}
```

这意味着无论装饰器持有哪个期物，我们都可以调用 `log` 函数。我们可以创造性地组合其他 trait，以便传入装饰器的期物可以产生关于期物的特定值，但对于这个示例，我们仅仅演示如何实现异步装饰器。现在我们可以定义一个简单的期物，包装它，并调用它：

```rust
async fn my_async_function() -> String {
    "Result of async computation".to_string()
}

#[tokio::main]
async fn main() {
    let logged_future = LoggingFuture { inner: my_async_function() };
    let result = logged_future.await;
    println!("{}", result);
}
```

运行我们的代码会产生以下输出：

```
Polling the future!
Result of async computation
```

在这里，我们可以看到日志装饰器起作用了。我们可以对装饰器使用相同的编译特性方法。

因为装饰器被设计为以最小的摩擦插入并具有相同的类型签名，它们不应该对程序的逻辑产生太大影响。如果我们想基于某些条件改变程序的流程，我们可以考虑使用状态机模式。

### 状态机模式

状态机持有特定的状态以及关于如何改变该状态的逻辑。其他进程可以引用该状态来指导它们的行动方式；这就是状态机模式。状态机的一个简单的现实例子是一组交通信号灯。根据国家的不同，交通信号灯可能会有所不同，但它们都至少有两种状态：红色和绿色。根据系统的不同，一系列输入和硬编码的逻辑可以随时间改变每个交通信号灯的状态。需要注意的是，司机直接观察交通信号灯的状态并据此采取行动。我们可以有任意多或任意少的司机，但契约保持不变。信号灯专注于维护状态并根据输入改变状态，而司机仅仅观察并对该状态做出反应。

有了这个类比，状态机可用于调度任务和管理作业队列、网络、创建工作流和管道，以及控制具有不同状态并响应异步输入和定时事件组合的机器/系统也就不足为奇了。

实际上，为了进一步说明，状态机的概念不仅限于像交通信号灯这样的具体示例。Rust 的 async/await 模型也依赖于期物是状态机的理念。一个期物表示一个可能尚不可用的值，随着其进展，它经历不同的状态（例如，`Pending`、`Ready`），直到产生结果或错误。

对于我们的示例，我们可以构建一个基本的开关状态，它要么开要么关。枚举非常适合管理状态，因为我们有匹配模式，并且枚举变体也可以容纳数据。我们简单的状态采用以下形式：

```rust
enum State {
    On,
    Off,
}
```

我们定义状态机消费以改变状态的事件状态：

```rust
enum Event {
    SwitchOn,
    SwitchOff,
}
```

现在我们有了事件和状态。事件和状态之间的接口可以用以下代码定义：

```rust
impl State {
    async fn transition(self, event: Event) -> Self {
        match (&self, event) {
            (State::On, Event::SwitchOff) => {
                println!("Transitioning to the Off state");
                State::Off
            },
            (State::Off, Event::SwitchOn) => {
                println!("Transitioning to the On state");
                State::On
            },
            _ => {
                println!(
                    "No transition possible, staying in the current state"
                );
                self
            },
        }
    }
}
```

在这里，我们可以看到，如果开关状态是开，那么关闭开关的事件将把状态转为关，反之亦然。我们可以测试我们的状态机：

```rust
#[tokio::main]
async fn main() {
    let mut state = State::On;

    state = state.transition(Event::SwitchOff).await;
    state = state.transition(Event::SwitchOn).await;
    state = state.transition(Event::SwitchOn).await;

    match state {
        State::On => println!("State machine is in the On state"),
        _ => println!("State machine is not in the expected state"),
    }
}
```

运行此代码会得到以下输出：

```
Transitioning to the Off state
Transitioning to the On state
No transition possible, staying in the current state
State machine is in the On state
```

在我们的示例中，异步代码不是必需的，但这是因为我们的示例很简单。例如，我们可以使用异步代码通过互斥锁访问状态，或通过异步通道监听事件。就像交通信号灯示例一样，我们的状态机将与在运行时中处理的异步任务解耦。例如，我们的状态机可以是一个包含计数和开或关枚举的结构体。其他任务在启动时可以通过通道向我们的状态机发送事件以增加计数。当计数超过某个阈值时，状态机可以将状态切换为关。如果新任务在启动前需要检查状态机是否为开状态，我们就实现了一个简单的信号系统，如果任务计数过高，它会限制新异步任务的进展。但是，如果我们愿意，我们可以用 `AtomicUsize` 替换这个开关，而不是 `AtomicBool`。但是，我们的状态机示例为我们根据需要实现更复杂的逻辑做好了准备。

我们的状态机也可以根据其状态轮询不同的期物。以下代码示例展示了如何根据开关状态轮询不同的期物：

```rust
struct StateFuture<F: Future, X: Future> {
    pub state: State,
    pub on_future: F,
    pub off_future: X,
}
```

现在状态机有了状态和两个要轮询的期物，我们可以实现轮询逻辑：

```rust
impl<F: Future, X: Future> Future for StateFuture<F, X> {
    type Output = State;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output> {
        match self.state {
            State::On => {
                let inner = unsafe {
                    self.map_unchecked_mut(|s| &mut s.on_future)
                };
                let _ = inner.poll(cx);
                cx.waker().wake_by_ref();
                Poll::Pending
            },
            State::Off => {
                let inner = unsafe {
                    self.map_unchecked_mut(|s| &mut s.off_future)
                };
                let _ = inner.poll(cx);
                cx.waker().wake_by_ref();
                Poll::Pending
            },
        }
    }
}
```

在这个示例中，期物将在后台持续轮询。这使得我们的状态机能够根据状态切换其连续操作。在轮询期物之前添加额外功能，例如通过通道监听事件以潜在地改变状态，可以轻松完成。

回到我们的状态机限制新任务进展的示例，检查状态机的异步任务应该如何处理关状态？这就是重试模式的用武之地。

### 重试模式

我们可能处于这样一种情况：我们的异步任务在尝试访问某些东西时被阻塞。这可能是我们的状态机说任务太多，或者服务器可能过载。我们不希望异步任务放弃，因此重试可能会得到我们想要的结果。但是，我们也不想无休止地冲击目标。如果服务器、互斥锁或数据库过载，我们最不应该做的就是向过载的目标发送背靠背的请求。

重试模式允许异步任务重试请求。然而，在每次重试中，有一个延迟，并且每次尝试的延迟都会加倍。这种退避将使我们的目标减少请求频率，以赶上目标正在处理的任务。

为了探索重试模式，我们最初定义一个总是返回错误的 `get_data` 函数：

```rust
async fn get_data() -> Result<String, Box<dyn std::error::Error>> {
    Err("Error".into())
}
```

然后我们定义一个实现重试函数的异步任务：

```rust
async fn do_something() -> Result<(), Box<dyn std::error::Error>> {
    let mut milliseconds = 1000;
    let total_count = 5;
    let mut count = 0;
    let result: String;
    loop {
        match get_data().await {
            Ok(data) => {
                result = data;
                break;
            },
            Err(err) => {
                println!("Error: {}", err);
                count += 1;
                if count == total_count {
                    return Err(err);
                }
            }
        }
        tokio::time::sleep(
            tokio::time::Duration::from_millis(milliseconds)
        ).await;
        milliseconds *= 2;
    }
    Ok(())
}
```

我们运行重试模式：

```rust
#[tokio::main]
async fn main() {
    let outcome = do_something().await;
    println!("Outcome: {:?}", outcome);
}
```

我们得到以下输出：

```
Error: Error
Error: Error
Error: Error
Error: Error
Error: Error
Outcome: Err("Error")
```

我们的重试起作用了。重试模式更像是一种实用工具，而不是整个应用程序的设计选择。当异步任务需要访问目标时，在整个应用程序中撒上重试模式，如果系统处理流量峰值，通过减少对目标的压力，将给你的系统带来更多的灵活性。

但是，如果我们持续收到错误怎么办？当然，如果超过某个阈值，继续生成任务就没有意义了。例如，如果服务器完全崩溃，必须有一个状态，我们不再通过发送更多请求来浪费 CPU 资源。这就是电路熔断器模式帮助我们的时候。

### 电路熔断器模式

电路熔断器模式在错误数量超过阈值时阻止任务被生成。与其定义我们自己的状态机（开或关），我们可以用两个简单的原子值来复制相同的效果，定义如下：

```rust
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::future::Future;
use tokio::task::JoinHandle;

static OPEN: AtomicBool = AtomicBool::new(false);
static COUNT: AtomicUsize = AtomicUsize::new(0);
```

前提相当简单。如果 `OPEN` 为 `true`，我们说明电路已打开，不能再生成新任务。如果发生错误，我们将 `COUNT` 加一，如果 `COUNT` 超过阈值，则将 `OPEN` 设置为 `true`。我们还需要编写我们自己的 `spawn_task` 函数，在生成任务之前检查 `OPEN`。我们的 `spawn_task` 函数采用以下形式：

```rust
fn spawn_task<F, T>(future: F) -> Result<JoinHandle<T>, String>
where
    F: Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    let open = OPEN.load(Ordering::SeqCst);
    if open == false {
        return Ok(tokio::task::spawn(future))
    }
    Err("Circuit Open".to_string())
}
```

现在我们可以定义两个简单的异步任务——一个抛出错误，另一个只是通过：

```rust
async fn error_task() {
    println!("error task running");
    let count = COUNT.fetch_add(1, Ordering::SeqCst);
    if count == 2 {
        println!("opening circuit");
        OPEN.store(true, Ordering::SeqCst);
    }
}
async fn passing_task() {
    println!("passing task running");
}
```

有了这些任务，我们可以确定系统何时会熔断。我们可以测试系统在达到三次错误时熔断：

```rust
#[tokio::main]
async fn main() -> Result<(), String> {
    let _ = spawn_task(passing_task())?.await;
    let _ = spawn_task(error_task())?.await;
    let _ = spawn_task(error_task())?.await;
    let _ = spawn_task(error_task())?.await;
    let _ = spawn_task(passing_task())?.await;
    Ok(())
}
```

这给我们以下输出：

```
passing task running
error task running
error task running
error task running
opening circuit
Error: "Circuit Open"
```

达到阈值后，我们无法再生成任务。我们可以对达到阈值时做什么发挥创意。也许我们跟踪所有任务，如果它们各自的阈值被打破，只阻止特定类型的任务。我们可以通过优雅的关闭来完全停止程序，并触发警报系统，以便开发人员和 IT 人员被告知关闭情况。我们也可以记录时间快照，并在一定时间后关闭电路。这些变化都取决于你要解决的问题和所需的解决方案。有了这个电路熔断器模式，我们已经介绍了足够的设计模式来帮助你在代码库中实现异步代码。

### 总结

在本章中，我们介绍了一系列设计模式，使你能够实现贯穿本书学习的异步代码。从整体角度思考代码库是关键。如果你正在集成到一个没有异步代码的现有代码库中，隔离模块是显而易见的第一步。本章中的所有设计模式都选择了简单的代码示例。小而简单的步骤对于实现异步代码是最好的。这种方法使测试更容易，并且如果最近的实现不再需要或破坏了代码库中的其他东西，可以让你回滚。

虽然预先应用设计模式很诱人，但过度工程化似乎是设计模式普遍受到的头号批评。像平常一样编写代码，并在设计模式自然呈现时考虑实现它。强迫应用设计模式会增加导致过度工程化的风险。理解设计模式对于知道何时何地实现它们至关重要。

在第10章中，我们将介绍使用标准库且没有外部依赖来构建我们自己的异步 TCP 服务器的网络异步方法。

## 第十章 构建一个无依赖的异步服务器  

我们现在来到了本书的倒数第二章。因此，我们需要重点关注理解异步在系统中的交互方式。为此，我们将完全使用标准库，不借助任何第三方依赖，构建一个异步服务器。这将巩固你对异步编程基本原理及其在软件系统大局中位置的理解。软件包、编程语言和 API 文档都会随时间变化。虽然理解当前的异步工具很重要，并且我们已在全书贯穿介绍了它们，但掌握异步编程的基础知识将使你能够轻松阅读未来遇到的新文档/工具/框架/语言。

通过本章的学习，你将能够构建一个多线程 TCP 服务器，该服务器将接受传入的请求，并将这些请求发送给异步执行器以进行异步处理。由于我们只使用标准库，你也将能够构建自己的异步执行器，该执行器接受任务并持续轮询它们直至完成。最后，你还将能够为向服务器发送请求的客户端实现此异步功能。这将赋予你能力和信心，用最少的依赖构建基本的异步解决方案，以解决轻量级问题。那么，让我们从设置这个项目的基础开始。

### 设置基础

对于我们的项目，我们将使用四个工作区，它们在根目录的 `Cargo.toml` 中定义：

```toml
[workspace]
members = [
    "client",
    "server",
    "data_layer",
    "async_runtime"
]
```

我们使用四个工作区的原因是这些模块之间有相当多的交叉使用。客户端和服务器将是分开的，以便可以分别调用它们。服务器和客户端都将使用我们的异步运行时，因此它需要是独立的。`data_layer` 只是一个序列化和反序列化自身的消息结构体。它需要放在一个独立的工作区中，因为客户端和服务器都将引用这个数据结构体。我们可以在 `data_layer/src/data.rs` 中编写我们的样板代码，布局如下：

```rust
use std::io::{self, Cursor, Read, Write};

#[derive(Debug)]
pub struct Data {
    pub field1: u32,
    pub field2: u16,
    pub field3: String,
}

impl Data {
    pub fn serialize(&self) -> io::Result<Vec<u8>> {
        // ...
    }
    pub fn deserialize(cursor: &mut Cursor<&[u8]>) -> io::Result<Data> {
        // ...
    }
}
```

`serialize` 和 `deserialize` 函数使我们能够通过 TCP 连接发送 `Data` 结构体。如果我们想处理更复杂的结构体，可以使用 `serde`，但本着本章的精神，我们将编写自己的序列化逻辑，因为我们整个应用程序不会使用任何依赖。不用担心，这是我们唯一需要编写的非异步样板代码。我们的 `serialize` 函数形式如下：

```rust
let mut bytes = Vec::new();
bytes.write(&self.field1.to_ne_bytes());
bytes.write(&self.field2.to_ne_bytes());
let field3_len = self.field3.len() as u32;
bytes.write(&field3_len.to_ne_bytes());
bytes.extend_from_slice(self.field3.as_bytes());
Ok(bytes)
```

我们为每个数字使用 4 个字节，再用另一个 4 字节整数来指定字符串的长度，因为字符串的长度是可变的。

对于我们的 `deserialize` 函数，我们向字节数组传递具有正确容量的数组和向量以进行读取，并将它们转换为正确的格式：

```rust
// 为字段初始化缓冲区，使用适当大小的数组
let mut field1_bytes = [0u8; 4];
let mut field2_bytes = [0u8; 2];

// 从游标读取第一个字段（4字节）到缓冲区。
// 对第二个字段执行相同操作。
cursor.read_exact(&mut field1_bytes);
cursor.read_exact(&mut field2_bytes);

// 将字节数组转换为适当的数据类型（u32 和 u16）
let field1 = u32::from_ne_bytes(field1_bytes);
let field2 = u16::from_ne_bytes(field2_bytes);

// 初始化一个缓冲区来读取第三个字段的长度，该长度为 4 字节
let mut len_bytes = [0u8; 4];

// 从游标读取长度到缓冲区
cursor.read_exact(&mut len_bytes);

// 将长度字节转换为 usize
let len = u32::from_ne_bytes(len_bytes) as usize;

// 初始化一个具有指定长度的缓冲区来保存第三个字段的数据
let mut field3_bytes = vec![0u8; len];

// 从游标读取第三个字段的数据到缓冲区
cursor.read_exact(&mut field3_bytes);

// 将第三个字段的字节转换为 UTF-8 字符串，如果无法转换则返回错误。
let field3 = String::from_utf8(field3_bytes)
    .map_err(|_| io::Error::new(
        io::ErrorKind::InvalidData, "Invalid UTF-8"
    ));
// 返回结构化数据
Ok(Data { field1, field2, field3 })
```

我们的数据层逻辑完成后，我们在 `data_layer/src/lib.rs` 文件中将 `Data` 结构体公开：

```rust
pub mod data;
```

数据层完成后，我们可以继续进行有趣的部分：仅使用标准库构建我们的异步运行时。

### 构建我们的标准库异步运行时

为了构建服务器的异步组件，我们需要按顺序构建以下组件：

1.  **唤醒器**：唤醒期物以便恢复执行
2.  **执行器**：处理期物直至完成
3.  **发送器**：实现异步数据发送的期物
4.  **接收器**：实现异步数据接收的期物
5.  **睡眠器**：实现异步任务睡眠的期物

考虑到我们需要唤醒器来帮助执行器重新激活任务以供再次轮询，我们将从构建唤醒器开始。

#### 构建我们的唤醒器

我们在整本书中实现 `Future` trait 时都使用了唤醒器，并且凭直觉知道需要 `wake` 或 `wake_by_ref` 函数来允许期物再次被轮询。因此，唤醒器是我们显而易见的第一选择，因为期物和执行器将处理唤醒器。为了构建我们的唤醒器，我们从 `async_runtime/src/waker.rs` 文件中的以下导入开始：

```rust
use std::task::{RawWaker, RawWakerVTable};
```

然后我们构建我们的唤醒器虚拟表：

```rust
static VTABLE: RawWakerVTable = RawWakerVTable::new(
    my_clone,
    my_wake,
    my_wake_by_ref,
    my_drop,
);
```

我们可以随意命名这些函数，只要它们具有正确的函数签名即可。`RawWakerVTable` 是一个虚拟函数指针表，`RawWaker` 指向它并调用它在其生命周期中执行操作。例如，如果在 `RawWaker` 上调用 `clone` 函数，则会调用 `RawWakerVTable` 中的 `my_clone` 函数。我们将尽可能简单地实现这些函数，但我们可以了解 `RawWakerVTable` 如何被利用。例如，具有静态生命周期且线程安全的数据结构可以通过与 `RawWakerVTable` 中的函数交互来跟踪我们系统中的唤醒器。

我们可以从我们的 `clone` 函数开始。这通常在我们轮询函数时被调用，因为我们需要在执行器中克隆唤醒器的原子引用，将其包装在上下文中，并传递给正在轮询的期物。我们的克隆实现形式如下：

```rust
unsafe fn my_clone(raw_waker: *const ()) -> RawWaker {
    RawWaker::new(raw_waker, &VTABLE)
}
```

我们的 `wake` 和 `wake_by_ref` 函数在应该再次轮询期物时被调用，因为等待的期物已就绪。对于我们的项目，我们将在没有被唤醒器提示的情况下轮询我们的期物以查看它们是否就绪，因此我们简单的实现定义如下：

```rust
unsafe fn my_wake(raw_waker: *const ()) {
    drop(Box::from_raw(raw_waker as *mut u32));
}
unsafe fn my_wake_by_ref(_raw_waker: *const ()) {
}
```

`my_wake` 函数将原始指针转换回 box 并丢弃它。这是合理的，因为 `my_wake` 应该消费唤醒器。`my_wake_by_ref` 函数什么也不做。它与 `my_wake` 函数相同，但不消费唤醒器。如果我们想尝试通知执行器，我们可以在这些函数中设置一个 `AtomicBool` 为 `true`。然后我们可以设计某种执行器机制，在费心轮询期物之前检查 `AtomicBool`，因为检查 `AtomicBool` 的计算成本低于轮询一个期物。我们也可以使用另一个队列来发送任务就绪通知，但对于我们的服务器实现，我们将坚持在不进行检查的情况下进行轮询。

当我们的任务完成或被取消时，我们不再需要轮询我们的任务，并且我们的唤醒器被丢弃。我们的 `drop` 函数形式如下：

```rust
unsafe fn my_drop(raw_waker: *const ()) {
    drop(Box::from_raw(raw_waker as *mut u32));
}
```

这就是我们将 box 转换回原始指针并丢弃它的地方。

现在我们已经为唤醒器定义了所有函数。我们只需要一个函数来创建唤醒器：

```rust
pub fn create_raw_waker() -> RawWaker {
    let data = Box::into_raw(Box::new(42u32));
    RawWaker::new(data as *const (), &VTABLE)
}
```

我们传入一些虚拟数据，并使用对我们的函数表的引用创建 `RawWaker`。我们可以看到这种原始方法的可定制性。我们可以有多个 `RawWakerVTable` 定义，并且我们可以根据传递给 `create_raw_waker` 函数的内容构造不同于 `RawWaker` 的函数表。在我们的执行器中，我们可以根据正在处理的期物类型来改变输入。我们也可以传递一个执行器持有的数据结构的引用，而不是 u32 数字 42。数字 42 没有特殊意义；它只是传递数据的一个例子。传递的数据结构随后可以在绑定到表的函数中被引用。

尽管我们已经构建了唤醒器的基本骨架，但我们可以体会到选择构建自己的唤醒器所具有的强大功能和可定制性。考虑到我们需要使用我们的唤醒器在执行器中执行任务，我们现在可以继续构建我们的执行器。

#### 构建我们的执行器

从高层次看，我们的执行器将消费期物，将它们转换为可以由我们的执行器运行的任务，返回一个句柄，并将任务放入队列。定期地，我们的执行器还将轮询该队列上的任务。我们将执行器放在 `async_runtime/src/executor.rs` 文件中。首先，我们需要以下导入：

```rust
use std::{
    future::Future,
    sync::{Arc, mpsc},
    task::{Context, Poll, Waker},
    pin::Pin,
    collections::VecDeque
};
use crate::waker::create_raw_waker;
```

在开始编写执行器之前，我们需要定义将在执行器中传递的任务结构体：

```rust
pub struct Task {
    future: Pin<Box<dyn Future<Output = ()> + Send>>,
    waker: Arc<Waker>,
}
```

当查看 `Task` 结构体时，你可能感觉有些不对劲，你是对的。我们 `Task` 结构体中的期物返回 `()`。然而，我们希望能够运行返回不同数据类型的任务。如果只能返回一种数据类型，运行时将会非常糟糕。你可能觉得需要传入一个泛型参数，导致以下代码：

```rust
pub struct Task<T> {
    future: Pin<Box<dyn Future<Output = T> + Send>>,
    waker: Arc<Waker>,
}
```

然而，对于泛型，编译器将查看 `Task<T>` 的所有实例，并为每个 `T` 的变体生成结构体。此外，我们的执行器将需要 `T` 泛型参数来处理 `Task<T>`。这将导致为每个 `T` 的变体生成多个执行器，从而造成混乱。相反，我们用一个异步块包装我们的期物，获取期物的结果，并通过通道发送该结果。因此，我们所有任务的签名都返回 `()`，但我们仍然可以从期物中提取结果。我们将在执行器的 `spawn` 函数中看到这是如何实现的。以下是我们的执行器的概要：

```rust
pub struct Executor {
    pub polling: VecDeque<Task>,
}
impl Executor {
    pub fn new() -> Self {
        Executor {
            polling: VecDeque::new(),
        }
    }
    pub fn spawn<F, T>(&mut self, future: F) -> mpsc::Receiver<T>
    where
        F: Future<Output = T> + 'static + Send,
        T: Send + 'static,
    {
        // ...
    }
    pub fn poll(&mut self) {
        // ...
    }
    pub fn create_waker(&self) -> Arc<Waker> {
        Arc::new(unsafe { Waker::from_raw(create_raw_waker()) })
    }
}
```

`Executor` 的 `polling` 字段是我们将放入已生成任务以供轮询的地方。

注意我们的 `Executor` 中的 `create_waker` 函数。记住，我们的 `Executor` 运行在一个线程上，一次只能处理一个期物。如果我们的 `Executor` 包含一个数据集合，并且我们配置了 `create_raw_waker` 来处理它，我们可以将一个引用传递给 `create_raw_waker` 函数。我们的唤醒器可以不安全地访问数据集合，因为一次只有一个期物被处理，因此不会同时有多个来自期物的可变引用。

一旦任务被轮询，如果任务仍处于挂起状态，我们将把任务放回轮询队列以便再次轮询。为了最初将任务放入队列，我们使用 `spawn` 函数：

```rust
pub fn spawn<F, T>(&mut self, future: F) -> mpsc::Receiver<T>
where
    F: Future<Output = T> + 'static + Send,
    T: Send + 'static,
{
    let (tx, rx) = mpsc::channel();
    let future: Pin<Box<dyn Future<Output = ()> + Send>> = Box::pin(
        async move {
            let result = future.await;
            let _ = tx.send(result);
        }
    );
    let task = Task {
        future,
        waker: self.create_waker(),
    };
    self.polling.push_back(task);
    rx
}
```

我们使用通道返回一个句柄，并将期物的返回值转换为 `()`。

如果暴露内部通道不符合你的风格，你可以为生成任务创建以下 `JoinHandle` 结构体来返回：

```rust
pub struct JoinHandle<T> {
    receiver: mpsc::Receiver<T>,
}

impl<T> JoinHandle<T> {
    pub fn await(self) -> Result<T, mpsc::RecvError> {
        self.receiver.recv()
    }
}
```

为你的返回句柄提供以下等待语法：

```rust
match handle.await() {
    Ok(result) => println!("Received: {}", result),
    Err(e) => println!("Error receiving result: {}", e),
}
```

现在我们已经将任务放入了轮询队列，我们可以使用执行器的轮询函数来轮询它：

```rust
pub fn poll(&mut self) {
    let mut task = match self.polling.pop_front() {
        Some(task) => task,
        None => return,
    };
    let waker = task.waker.clone();
    let context = &mut Context::from_waker(&waker);
    match task.future.as_mut().poll(context) {
        Poll::Ready(()) => {}
        Poll::Pending => {
            self.polling.push_back(task);
        }
    }
}
```

我们只是从队列前端弹出任务，将唤醒器的引用包装在上下文中，并将其传递给期物的 `poll` 函数。如果期物已就绪，我们不需要做任何事情，因为我们通过通道发送结果，然后期物被丢弃。如果期物处于挂起状态，我们就把它放回队列。

现在，我们的异步运行时的核心已经完成，我们可以运行异步代码了。在我们构建异步运行时模块的其余部分之前，我们应该绕个道，运行一下我们的执行器。你不仅一定会对它能够工作感到兴奋，而且还可能想尝试自定义期物的处理方式。现在是感受我们的系统如何运作的好时机。

#### 运行我们的执行器

运行我们的异步运行时相当简单。在我们异步运行时模块的 `main.rs` 文件中，我们导入以下内容：

```rust
use std::{
    future::Future,
    task::{Context, Poll},
    pin::Pin
};
mod executor;
mod waker;
```

我们需要一个基本的期物来追踪我们的系统是如何运行的。我们在整本书中一直使用计数期物，因为它是一个如此容易实现的期物，它根据状态返回 `Pending` 或 `Ready`。作为快速参考（希望你现在能凭记忆编写），计数期物形式如下：

```rust
pub struct CountingFuture {
    pub count: i32,
}

impl Future for CountingFuture {
    type Output = i32;
    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output> {
        self.count += 1;
        if self.count == 4 {
            println!("CountingFuture is done!");
            Poll::Ready(self.count)
        } else {
            cx.waker().wake_by_ref();
            println!("CountingFuture is not done yet! {}",
                self.count
            );
            Poll::Pending
        }
    }
}
```

我们定义期物，定义执行器，生成期物，然后运行它们，代码如下：

```rust
fn main() {
    let counter = CountingFuture { count: 0 };
    let counter_two = CountingFuture { count: 0 };
    let mut executor = executor::Executor::new();
    let handle = executor.spawn(counter);
    let _handle_two = executor.spawn(counter_two);
    std::thread::spawn(move || {
        loop {
            executor.poll();
        }
    });
    let result = handle.recv().unwrap();
    println!("Result: {}", result);
}
```

我们生成一个线程并运行一个无限循环来轮询执行器中的期物。在这个循环运行的同时，我们等待其中一个期物的结果。在我们的服务器中，我们将正确地实现我们的执行器，以便它们能够在整个程序的生命周期内持续接收期物。这个快速实现给我们以下打印输出：

```
    CountingFuture is not done yet! 1
    CountingFuture is not done yet! 1
    CountingFuture is not done yet! 2
    CountingFuture is not done yet! 2
    CountingFuture is not done yet! 3
    CountingFuture is not done yet! 3
    CountingFuture is done!
    CountingFuture is done!
    Result: 4
```

我们可以看到它工作正常！我们有了一个仅使用标准库运行的异步运行时！

记住我们的唤醒器实际上没有做任何事情。无论怎样，我们都在执行器队列中轮询我们的期物。如果你在 `CountingFuture` 的 `poll` 函数中注释掉 `cx.waker().wake_by_ref();` 这一行，你会得到完全相同的结果，这与像 `smol` 或 `Tokio` 这样的运行时中的情况不同。这告诉我们，成熟的运行时正在使用唤醒器来只轮询那些需要被唤醒的期物。这意味着成熟的运行时在轮询方面更高效。

现在我们的异步运行时已经运行起来了，我们可以将其余的异步过程推进到终点。我们可以从一个发送器开始。

#### 构建我们的发送器

当通过 TCP 套接字发送数据时，我们必须允许执行器在当前连接被阻塞时切换到另一个异步任务。如果连接没有被阻塞，我们可以将字节写入流。在 `async_runtime/src/sender.rs` 文件中，我们从以下导入开始：

```rust
use std::{
    future::Future,
    task::{Context, Poll},
    pin::Pin,
    net::TcpStream,
    io::{self, Write},
    sync::{Arc, Mutex}
};
```

我们的发送器本质上是一个期物。在 `poll` 函数期间，如果流被阻塞，我们将返回 `Pending`；如果流没有被阻塞，我们则将字节写入流。我们的发送器结构定义如下：

```rust
pub struct TcpSender {
    pub stream: Arc<Mutex<TcpStream>>,
    pub buffer: Vec<u8>
}

impl Future for TcpSender {
    type Output = io::Result<()>;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output> {
        // ...
    }
}
```

我们的 `TcpStream` 包装在 `Arc<Mutex<T>>` 中。我们使用 `Arc<Mutex<T>>` 以便可以将 `TcpStream` 传递给 `Sender` 和 `Receiver`。一旦我们通过流发送了字节，我们将需要使用 `Receiver` 期物来等待响应。

对于 `TcpSender` 结构体中的 `poll` 函数，我们首先尝试获取流的锁：

```rust
let mut stream = match self.stream.try_lock() {
    Ok(stream) => stream,
    Err(_) => {
        cx.waker().wake_by_ref();
        return Poll::Pending;
    }
};
```

如果我们无法获取锁，我们返回 `Pending`，这样我们就不会阻塞执行器，任务将被放回队列以便再次轮询。一旦我们获得了锁，我们将其设置为非阻塞：

```rust
stream.set_nonblocking(true);
```

`set_nonblocking` 函数使得流从 `write`、`recv`、`read` 或 `send` 函数立即返回结果。如果 I/O 操作成功，结果将是 `Ok`。如果 I/O 操作返回一个 `io::ErrorKind::WouldBlock` 错误，则需要重试 I/O 操作，因为流被阻塞了。我们如下处理这些 I/O 操作结果：

```rust
match stream.write_all(&self.buffer) {
    Ok(_) => {
        Poll::Ready(Ok(()))
    },
    Err(ref e) if e.kind() == io::ErrorKind::WouldBlock => {
        cx.waker().wake_by_ref();
        Poll::Pending
    },
    Err(e) => Poll::Ready(Err(e))
}
```

现在我们定义了一个发送器期物，所以我们可以继续构建我们的接收器期物。

#### 构建我们的接收器

我们的接收器将等待流中的数据，如果字节不在流中可供读取，则返回 `Pending`。为了构建这个期物，我们在 `async_runtime/src/receiver.rs` 文件中导入以下内容：

```rust
use std::{
    future::Future,
    task::{Context, Poll},
    pin::Pin,
    net::TcpStream,
    io::{self, Read},
    sync::{Arc, Mutex}
};
```

鉴于我们要返回字节，接收器期物采用以下形式应该不会令人惊讶：

```rust
pub struct TcpReceiver {
    pub stream: Arc<Mutex<TcpStream>>,
    pub buffer: Vec<u8>
}
impl Future for TcpReceiver {
    type Output = io::Result<Vec<u8>>;
    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output> {
        // ...
    }
}
```

在我们的 `poll` 函数中，我们获取流的锁并将其设置为非阻塞，就像我们在发送器期物中所做的那样：

```rust
let mut stream = match self.stream.try_lock() {
    Ok(stream) => stream,
    Err(_) => {
        cx.waker().wake_by_ref();
        return Poll::Pending;
    }
};

stream.set_nonblocking(true);
```

接下来我们处理流的读取：

```rust
let mut local_buf = [0; 1024];

match stream.read(&mut local_buf) {
    Ok(0) => {
        Poll::Ready(Ok(self.buffer.to_vec()))
    },
    Ok(n) => {
        std::mem::drop(stream);
        self.buffer.extend_from_slice(&local_buf[..n]);
        cx.waker().wake_by_ref();
        Poll::Pending
    },
    Err(ref e) if e.kind() == io::ErrorKind::WouldBlock => {
        cx.waker().wake_by_ref();
        Poll::Pending
    },
    Err(e) => Poll::Ready(Err(e))
}
```

现在我们已经拥有了让服务器运行所需的所有异步功能。然而，还有一个基本的期物可以让我们构建，以便让同步代码也具备异步特性：睡眠期物。

#### 构建我们的睡眠器

我们之前已经介绍过，希望你自己能够实现它。不过，作为参考，我们的 `async_runtime/src/sleep.rs` 文件将存放我们的睡眠期物。我们导入以下内容：

```rust
use std::{
    future::Future,
    pin::Pin,
    task::{Context, Poll},
    time::{Duration, Instant},
};
```

我们的 `Sleep` 结构体形式如下：

```rust
pub struct Sleep {
    when: Instant,
}
impl Sleep {
    pub fn new(duration: Duration) -> Self {
        Sleep {
            when: Instant::now() + duration,
        }
    }
}
```

并且我们的 `Sleep` 期物实现了 `Future` trait：

```rust
impl Future for Sleep {
    type Output = ();
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>)
        -> Poll<Self::Output> {
        let now = Instant::now();
        if now >= self.when {
            Poll::Ready(())
        } else {
            cx.waker().wake_by_ref();
            Poll::Pending
        }
    }
}
```

现在我们的异步系统已经具备了所需的一切。为了使我们的异步运行时组件公开可用，我们在 `async_runtime/src/lib.rs` 文件中添加以下代码：

```rust
pub mod executor;
pub mod waker;
pub mod receiver;
pub mod sleep;
pub mod sender;
```

我们现在可以将我们的组件导入到服务器中。考虑到所有功能都已完备，我们应该使用它们来构建我们的服务器。

### 构建我们的服务器

为了构建我们的服务器，我们需要我们编码的数据和异步模块。要安装这些，`Cargo.toml` 文件依赖项形式如下：

```toml
[dependencies]
data_layer = { path = "../data_layer" }
async_runtime = { path = "../async_runtime" }

[profile.release]
opt-level = 'z'
```

我们使用 `opt-level = 'z'` 来优化二进制文件大小。

我们服务器的所有代码都可以放在 `main.rs` 文件中，该文件需要这些导入：

```rust
use std::{
    thread,
    sync::{mpsc::channel, atomic::{AtomicBool, Ordering}},
    io::{self, Read, Write, ErrorKind, Cursor},
    net::{TcpListener, TcpStream}
};
use data_layer::data::Data;
use async_runtime::{
    executor::Executor,
    sleep::Sleep
};
```

现在我们拥有了所需的一切，我们可以构建接受请求的代码了。

#### 接受请求

我们可以让主线程监听传入的 TCP 请求。然后主线程将请求分发给三个线程和执行器，如图 10-1 所示。

**图 10-1. 处理传入请求**

我们还希望在没有请求要处理时，线程能够进入停放状态。为了与停放线程通信，我们为每个线程准备一个 `AtomicBool`：

```rust
static FLAGS: [AtomicBool; 3] = [
    AtomicBool::new(false),
    AtomicBool::new(false),
    AtomicBool::new(false),
];
```

每个 `AtomicBool` 代表一个线程。如果 `AtomicBool` 为 `false`，表示线程未停放。如果 `AtomicBool` 为 `true`，那么我们的路由器就知道我们的线程已停放，我们必须在向线程发送请求之前唤醒它。

现在我们有了 `FLAGS`，我们必须处理每个线程的传入请求。在线程内部，我们创建一个执行器，然后尝试在线程的通道中接收消息。如果通道中有请求，我们就在该执行器上生成一个任务。如果没有传入请求，我们检查是否有等待轮询的任务。如果没有任务，那么线程将 `FLAG` 设置为 `true` 并停放线程。如果有任何任务需要轮询，那么我们就在循环结束时轮询该任务。我们可以用这个宏来执行这个过程：

```rust
macro_rules! spawn_worker {
    ($name:expr, $rx:expr, $flag:expr) => {
        thread::spawn(move || {
            let mut executor = Executor::new();
            loop {
                if let Ok(stream) = $rx.try_recv() {
                    println!(
                        "{} Received connection: {}",
                        $name,
                        stream.peer_addr().unwrap()
                    );
                    executor.spawn(handle_client(stream));
                } else {
                    if executor.polling.len() == 0 {
                        println!("{} is sleeping", $name);
                        $flag.store(true, Ordering::SeqCst);
                        thread::park();
                    }
                }
                executor.poll();
            }
        });
    };
}
```

在这个宏中，我们接受线程的名称用于日志记录、用于接收传入请求的通道的接收端，以及用于通知系统线程何时停放的标志。

关于创建复杂宏的更多信息，可以阅读 Ingvar Stepanyan 的《在 Rust 中编写复杂宏》。

我们可以在主函数中编排请求的接受：

```rust
fn main() -> io::Result<()> {
    // ...
    Ok(())
}
```

首先，我们定义用于向线程发送请求的通道：

```rust
let (one_tx, one_rx) = channel::<TcpStream>();
let (two_tx, two_rx) = channel::<TcpStream>();
let (three_tx, three_rx) = channel::<TcpStream>();
```

然后我们创建处理请求的线程：

```rust
let one = spawn_worker!("One", one_rx, &FLAGS[0]);
let two = spawn_worker!("Two", two_rx, &FLAGS[1]);
let three = spawn_worker!("Three", three_rx, &FLAGS[2]);
```

现在我们的执行器在它们自己的线程中运行，等待我们的 TCP 监听器向它们发送请求。我们需要保存并引用线程句柄和线程通道发送器，以便我们可以唤醒并向单个线程发送请求。我们可以使用以下代码与线程交互：

```rust
let router = [one_tx, two_tx, three_tx];
let threads = [one, two, three];
let mut index = 0;

let listener = TcpListener::bind("127.0.0.1:7878");
println!("Server listening on port 7878");

for stream in listener.incoming() {
    // ...
}
```

我们现在只需要处理传入的 TCP 请求：

```rust
for stream in listener.incoming() {
    match stream {
        Ok(stream) => {
            let _ = router[index].send(stream);
            if FLAGS[index].load(Ordering::SeqCst) {
                FLAGS[index].store(false, Ordering::SeqCst);
                threads[index].thread().unpark();
            }
            index += 1; // 循环遍历线程索引
            if index == 3 {
                index = 0;
            }
        }
        Err(e) => {
            println!("Connection failed: {}", e);
        }
    }
}
```

一旦我们收到 TCP 请求，我们就将 TCP 流发送给一个线程，检查线程是否已停放，并在需要时唤醒该线程。接下来，我们将索引移动到下一个线程，以便在所有线程之间均匀分配请求。

那么，一旦我们将请求发送给执行器，我们如何处理这些请求呢？我们处理它们。

#### 处理请求

在处理请求时，我们回想一下 `handle_stream` 函数是在执行器中调用的。我们的处理异步函数形式如下：

```rust
async fn handle_client(mut stream: TcpStream) -> std::io::Result<()> {
    stream.set_nonblocking(true);
    let mut buffer = Vec::new();
    let mut local_buf = [0; 1024];
    loop {
        // ...
    }
    match Data::deserialize(&mut Cursor::new(buffer.as_slice())) {
        Ok(message) => {
            println!("Received message: {:?}", message);
        },
        Err(e) => {
            println!("Failed to decode message: {}", e);
        }
    }
    Sleep::new(std::time::Duration::from_secs(1)).await;
    stream.write_all(b"Hello, client!")?;
    Ok(())
}
```

这看起来应该类似于我们在异步运行时中构建的发送器和接收器期物。在这里，我们添加了 1 秒的异步睡眠。这只是为了模拟正在进行的工作。这也将确保我们的异步正常工作。如果我们的异步没有正常工作，我们发送 10 个请求，那么总时间将超过 10 秒。

在我们的循环内部，我们处理传入的流：

```rust
match stream.read(&mut local_buf) {
    Ok(0) => {
        break;
    },
    Ok(len) => {
        buffer.extend_from_slice(&local_buf[..len]);
    },
    Err(ref e) if e.kind() == ErrorKind::WouldBlock => {
        if buffer.len() > 0 {
            break;
        }
        Sleep::new(std::time::Duration::from_millis(10)).await;
        continue;
    },
    Err(e) => {
        println!("Failed to read from connection: {}", e);
    }
}
```

如果发生阻塞，我们引入一个微小的异步睡眠，这样执行器就会将请求处理放回队列以轮询其他请求处理。

我们的服务器现在已经完全功能完备。剩下唯一需要编码的部分是我们的客户端。

#### 构建我们的异步客户端

因为我们的客户端也依赖于相同的依赖项，客户端的 `Cargo.toml` 具有以下依赖项并不奇怪：

```toml
[dependencies]
data_layer = { path = "../data_layer" }
async_runtime = { path = "../async_runtime" }
```

在我们的 `main.rs` 文件中，我们需要以下导入：

```rust
use std::{
    io,
    sync::{Arc, Mutex},
    net::TcpStream,
    time::Instant
};

use data_layer::data::Data;
use async_runtime::{
    executor::Executor,
    receiver::TcpReceiver,
    sender::TcpSender,
};
```

为了发送，我们实现来自异步运行时的发送和接收期物：

```rust
async fn send_data(field1: u32, field2: u16, field3: String)
-> io::Result<String> {
    let stream = Arc::new(Mutex::new(TcpStream::connect(
        "127.0.0.1:7878"
    )?));
    let message = Data {field1, field2, field3};
    TcpSender {
        stream: stream.clone(),
        buffer: message.serialize()?,
    }.await?;
    let receiver = TcpReceiver {
        stream: stream.clone(),
        buffer: Vec::new()
    };
    String::from_utf8(receiver.await?).map_err(|_|
        io::Error::new(io::ErrorKind::InvalidData, "Invalid UTF-8")
    )
}
```

我们现在可以调用我们的异步 `send_data` 函数 4000 次，并等待所有这些句柄：

```rust
fn main() -> io::Result<()> {
    let mut executor = Executor::new();
    let mut handles = Vec::new();
    let start = Instant::now();
    for i in 0..4000 {
        let handle = executor.spawn(send_data(
            i, i as u16, format!("Hello, server! {}", i)
        ));
        handles.push(handle);
    }
    std::thread::spawn(move || {
        loop {
            executor.poll();
        }
    });

    println!("Waiting for result...");
    for handle in handles {
        match handle.recv().unwrap() {
            Ok(result) => println!("Result: {}", result),
            Err(e) => println!("Error: {}", e)
        };
    }
    let duration = start.elapsed();
    println!("Time elapsed in expensive_function() is: {:?}", duration);
    Ok(())
}
```

我们的测试已经准备就绪。如果你在不同的终端中运行服务器和客户端，你将看到所有打印输出都显示请求正在被处理。整个客户端进程大约需要 1.2 秒，这意味着我们的异步系统正在运行。就是这样！我们已经构建了一个零第三方依赖的异步服务器！

### 总结

在本章中，我们仅使用标准库构建了一个相当高效的异步运行时。这种性能部分源于我们用 Rust 编码服务器。另一个因素是我们的异步模块提高了 I/O 密集型任务（如连接）的资源利用率。当然，我们的服务器不会像 Tokio 这样的运行时那样高效，但它是可用的。

我们并不建议你开始从项目中移除 Tokio 和 Web 框架，因为许多 crate 都是为了与 Tokio 等运行时集成而构建的。你会失去与第三方 crate 的许多集成，并且你的运行时也不会那么高效。但是，你可以在程序中同时激活另一个运行时。例如，我们可以使用 Tokio 通道将任务发送到我们的自定义异步运行时。这意味着 Tokio 可以在等待自定义异步运行时中任务完成的同时，处理其他异步 Tokio 任务。这种方法很有用，当你需要一个像 Tokio 这样成熟的运行时来处理标准的异步任务（如传入请求），但同时你也非常需要以特定的方式处理某个利基问题的任务。例如，你可能构建了一个键值存储，并阅读了关于如何在其上处理事务的最新计算机科学论文。然后你想直接在自定义异步运行时中实现该逻辑。

我们可以得出结论，构建自己的异步运行时既不是最好的方法，也不是最差的方法。了解成熟的运行时并能够构建自己的运行时，是两全其美。同时掌握这两种工具，并知道在何时何地应用它们，比做一个工具的传道者要好得多。然而，在你拿出它们并用它们解决问题之前，你需要练习这些工具。我们建议你在各种项目中继续尝试自定义异步运行时。尝试在唤醒器周围使用不同类型的数据是探索多种方法的一个良好开端。

测试是探索和完善方法的重要部分。测试使你能够获得关于异步代码和实现的深入、直接的反馈。在第 11 章中，我们将介绍如何测试异步代码，以便你能够继续探索异步概念和实现。

## 第十一章 测试

到目前为止，我们已经知道用 Rust 编写异步系统有多么强大。然而，在 Rust 中构建大型异步系统时，我们需要知道如何测试我们的异步代码。这是因为系统的复杂性会随着系统规模的增加而增长。

测试增加了我们正在实现的代码的反馈，使我们的代码编写更快、更安全。例如，如果我们有一个大型代码库，需要修改或向一段代码中添加功能，如果我们必须启动整个系统并运行以查看代码是否工作，那将既缓慢又危险。相反，修改或添加我们需要的代码并运行该段代码的特定测试，不仅提供了更快的反馈循环，还使我们能够测试更多的边缘情况，从而使我们的代码更安全。在本章中，我们将探讨测试异步代码以及我们的代码与外部系统之间接口的各种方法。

通过本章的学习，你将能够构建隔离的测试，在那里你可以模拟接口并检查对这些接口的调用。这使你能够构建真正隔离的原子测试。你还将能够测试同步陷阱，如死锁、竞态条件和阻塞异步任务的通道容量问题。最后，你还将学习如何模拟与网络（如服务器）的交互，获得对所有期物的细粒度测试控制，并知道何时轮询它们以查看你的系统在不同轮询条件下的进展情况。

我们可以从覆盖同步测试的基础知识开始我们的测试之旅。

### 进行基本的同步测试

在第179页的“构建隔离模块”中，我们构建了一个具有同步接口的异步运行时环境。毫不奇怪，由于该接口只包含几个同步函数，隔离模块是最容易测试的之一。我们可以通过执行同步测试来开始我们的测试之旅。

在构建我们的测试之前，我们需要在 `Cargo.toml` 中添加以下依赖项：

```toml
[dev-dependencies]
mockall = "0.11.4"
```

`mockall` 依赖项将使我们能够模拟 trait 及其函数，以便我们可以检查输入和模拟输出。

对于我们隔离模块的接口，我们回想一下，这两个函数是 `spawn`（它返回一个键）和 `get_result`（它返回我们生成的异步任务的结果）。我们可以为这些交互定义以下 trait：

```rust
pub trait AsyncProcess<X, Y, Z> {
    fn spawn(&self, input: X) -> Result<Y, String>;
    fn get_result(&self, key: Y) -> Result<Z, String>;
}
```

这里，我们使用泛型参数，以便我们可以改变输入、输出和使用的键的类型。我们现在可以继续我们的异步函数，在那里我们生成一个任务，打印一些内容，然后从异步函数获取结果并处理该结果：

```rust
fn do_something<T>(async_handle: T, input: i32) -> Result<i32, String>
where
    T: AsyncProcess<i32, String, i32>
{
    let key = async_handle.spawn(input);
    println!("something is happening");
    let result = async_handle.get_result(key);
    if result > 10 {
        return Err("result is too big".to_string());
    }
    if result == 8 {
        return Ok(result * 2)
    }
    Ok(result * 3)
}
```

这里，我们依赖于**依赖注入**。在依赖注入中，我们将一个结构体、对象或函数作为参数传递给另一个函数。我们传入该函数的对象随后执行计算。

对于我们来说，我们传入一个实现了该 trait 的结构体，然后调用该 trait。这很强大。例如，我们可以为一个结构体实现一个读取 trait，该结构体从数据库访问读取函数。然而，我们可以获得另一个处理从文件读取的结构体，并也实现读取 trait。根据我们想要的存储解决方案，我们只需将该句柄提供给函数。你可能已经猜到，我们可以创建一个模拟结构体，并为在该模拟结构体上实现的 trait 实现我们想要的任何功能，然后将模拟结构体传递给我们要测试的函数。然而，如果我们使用 mockall 来正确地模拟我们的结构体，我们还可以断言某些条件，例如传递给句柄函数的参数。我们的测试布局采用以下形式：

```rust
#[cfg(test)]
mod get_team_processes_tests {
    use super::*;
    use mockall::predicate::*;
    use mockall::mock;

    mock! {
        DatabaseHandler {}
        impl AsyncProcess<i32, String, i32> for DatabaseHandler {
            fn spawn(&self, input: i32) -> Result<String, String>;
            fn get_result(&self, key: String) -> Result<i32, String>;
        }
    }
    #[test]
    fn do_something_fail() {
        // ...
    }
}
```

在我们的 `do_something_fail` 测试函数中，我们定义模拟句柄，并断言将 `4` 传递给 `spawn` 函数，然后该函数将返回一个 `test_key`：

```rust
let mut handle = MockDatabaseHandler::new();
handle.expect_spawn()
    .with(eq(4))
    .returning(|_| { Ok("test_key".to_string()) });
```

现在我们有了 `test_key`，我们可以假设它将被传递给我们的 `get_result` 函数，并且我们声明 `get_result` 将返回 `11`：

```rust
handle.expect_get_result().with(eq("test_key".to_string()))
    .returning(|_| { Ok(11) });
```

我们可以假设我们正在测试的函数将返回一个错误，所以我们断言这一点：

```rust
let outcome = do_something(handle, 4);
assert_eq!(outcome, Err("result is too big".to_string()));
```

我们在测试过程中遵循行业标准的 Arrange、Act、Assert 模式：

**Arrange（准备）**
我们设置测试环境并定义模拟的预期行为。（这是在创建模拟句柄并指定预期输入和输出时完成的。）

**Act（执行）**
我们在准备好的条件下执行被测试的函数。（这发生在我们调用 `do_something(handle, 4)` 时。）

**Assert（断言）**
我们验证结果是否符合我们的预期。（这是我们使用 `assert_eq!` 检查结果的地方。）

现在我们的测试已经定义好了，我们可以使用 `cargo test` 命令运行它，结果如下打印输出：

```
running 1 test
test get_team_processes_tests::do_something_fail ... ok
```

我们的测试通过了。尽管为了简洁起见，我们不会在本书中定义每一个可能的结果，但尝试所有的边缘情况对你来说是一个很好的练习单元测试的机会。

模拟功能强大，因为它使我们能够隔离逻辑。假设我们的 `do_something` 函数位于一个要求数据库处于特定状态的应用程序中。例如，如果 `do_something` 处理数据库中团队成员的数量，那么团队很可能需要存在于数据库中。然而，如果我们想要运行 `do_something`，我们不希望在运行代码之前必须填充数据库并确保一切准备就绪。这样做有几个原因。如果我们想要为另一个边缘案例重新定义参数，我们将不得不重新调整数据库。这将花费很长时间，并且每次运行代码时，我们都必须再次摆弄数据库。模拟使我们的测试具有原子性。我们可以在不需要设置环境的情况下反复运行我们的代码。采用测试驱动开发的开发人员通常以更快的速度和更少的错误进行开发。

我们已经为程序定义了基本的模拟，但我们不会在所有地方都使用隔离模块。你的代码可能是完全异步的。尤其是在进行 Web 开发时。你可能希望在异步模块中测试异步函数。为此，我们需要涵盖异步模拟。

### 模拟异步代码

为了测试我们的异步 trait，我们需要在测试函数中有一个异步运行时。你可以自由选择你习惯的任何运行时，但对于我们的示例，我们将继续使用 Tokio，这给我们以下依赖项：

```toml
[dependencies]
tokio = { version = "1.34.0", features = ["full"] }

[dev-dependencies]
mockall = "0.11.4"
```

我们的 trait 不再需要两个函数，因为我们的 trait 是异步的；异步函数将返回一个我们可以等待的句柄。所以我们只有 `get_result` 函数，因为句柄在异步代码中管理：

```rust
use std::future::Future;

pub trait AsyncProcess<X, Z> {
    fn get_result(&self, key: X) -> impl Future<Output = Result<Z, String>> + Send + 'static;
}
```

我们 `AsyncProcess` trait 中的 `get_result` 函数返回一个期物，而不是 `get_result` 本身是一个异步函数。这种去糖化使我们能够对期物实现的 trait 进行更多控制。

我们的 `do_something` 函数也重新定义如下：

```rust
async fn do_something<T>(async_handle: T, input: i32) -> Result<i32, String>
where
    T: AsyncProcess<i32, i32> + Send + Sync + 'static
{
    println!("something is happening");
    let result: i32 = async_handle.get_result(input).await?;
    if result > 10 {
        return Err("result is too big".to_string());
    }
    if result == 8 {
        return Ok(result * 2)
    }
    Ok(result * 3)
}
```

我们处理结果的逻辑保持不变：我们在打印语句之前生成任务，并在打印语句之后获取结果。然而，在我们进行任何模拟之前，我们必须确保我们的测试模块有以下导入：

```rust
use super::*;
use mockall::predicate::*;
use mockall::mock;
use std::boxed::Box;
```

因为我们的 trait 现在只有一个函数，我们的模拟用以下代码重新定义：

```rust
mock! {
    DatabaseHandler {}
    impl AsyncProcess<i32, i32> for DatabaseHandler {
        fn get_result(&self, key: i32) -> impl Future<Output = Result<i32, String>> + Send + 'static;
    }
}
```

现在我们的函数是异步的，我们需要在每个测试内部定义一个运行时，然后阻塞等待它。我们的测试不会都在一个线程上运行，所以我们可以通过在每个单独的测试中定义运行时来确保测试是原子的：

```rust
#[test]
fn do_something_fail() {
    let mut handle = MockDatabaseHandler::new();
    handle.expect_get_result()
        .with(eq(4))
        .returning(
            |_| {
                Box::pin(async move { Ok(11) })
            }
        );
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();
    let outcome = runtime.block_on(do_something(handle, 4));
    assert_eq!(outcome, Err("result is too big".to_string()));
}
```

现在我们已经为异步代码实现了模拟。我们建议将与 HTTP 请求或数据库连接等其他资源交互的流程实现为隔离的异步函数。这使得它们更容易模拟，从而使我们的代码更容易测试。然而，我们知道在异步中，对外部资源进行调用并不是我们在测试异步代码时唯一需要记住的事情。请记住，我们的异步代码也可能出现死锁等同步问题，所以我们需要测试这些。

### 测试死锁

在死锁中，异步任务由于锁而无法完成。并非本书中所有示例都暴露了异步系统可能出现的死锁，但死锁确实可能发生。创建死锁的一个简单例子是让两个异步任务尝试以相反的顺序访问相同的两个锁（图 11-1）。

**图 11-1. 死锁**

在图 11-1 中，任务一获取了锁一。任务二获取了锁二。然而，两个任务都没有释放自己的锁，同时每个任务都试图获取另一个已经被持有的锁。这导致死锁：这两个任务永远不会完成，因为它们永远无法获取它们试图获取的第二个锁。

这种死锁不仅会阻碍这两个任务。如果其他任务需要访问这些锁，它们也会在生成时被阻塞；在我们的系统完全停滞之前，我们都不会意识到这一点。测试死锁很重要。通过单元测试，我们可以尝试在将代码集成到系统的其余部分之前捕获这些死锁。对于我们的测试，我们有如下大纲：

```rust
#[cfg(test)]
mod tests {
    use tokio::sync::Mutex;
    use std::sync::Arc;
    use tokio::time::{sleep, Duration, timeout};

    #[tokio::test]
    async fn test_deadlock_detection() {
        // ...
    }
}
```

我们使用 `#[tokio::test]` 宏进行测试。这本质上与在测试函数中创建异步运行时相同。在我们的测试函数中，我们创建两个互斥锁和这些互斥锁的引用，这样两个任务都可以访问两个互斥锁：

```rust
let resource1 = Arc::new(Mutex::new(0));
let resource2 = Arc::new(Mutex::new(0));

let resource1_clone = Arc::clone(&resource1);
let resource2_clone = Arc::clone(&resource2);
```

然后我们生成两个任务：

```rust
let handle1 = tokio::spawn(async move {
    let _lock1 = resource1.lock().await;
    sleep(Duration::from_millis(100)).await;
    let _lock2 = resource2.lock().await;
});

let handle2 = tokio::spawn(async move {
    let _lock2 = resource2_clone.lock().await;
    sleep(Duration::from_millis(100)).await;
    let _lock1 = resource1_clone.lock().await;
});
```

我们的第一个任务先获取第一个互斥锁，在休眠后获取第二个互斥锁。第二个任务试图以相反的顺序获取锁。休眠函数将使两个任务都有时间在尝试获取第二个锁之前获取它们的第一个锁。我们现在想等待这些已生成的任务，但我们在测试死锁。如果发生死锁而我们没有设置超时，测试将无限期地挂起。为了避免这种情况，我们可以设置一个超时：

```rust
let result = timeout(Duration::from_secs(5), async {
    let _ = handle1.await;
    let _ = handle2.await;
}).await;
```

超时时间相当长，但如果两个异步任务在 5 秒后仍未完成，我们可以断定发生了死锁。现在我们已经设置了超时，我们可以用以下代码检查它：

```rust
assert!(result.is_ok(), "A potential deadlock detected!");
```

运行我们的测试会得到以下打印输出：

```
thread 'tests::test_deadlock_detection' panicked at 'A potential deadlock detected!', src/main.rs:43:9
note: run with 'RUST_BACKTRACE=1' environment variable to display a backtrace
test tests::test_deadlock_detection ... FAILED

failures:
    tests::test_deadlock_detection

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 5.01s
```

时间刚过 5 秒，我们得到一个有用的消息，提示检测到潜在的死锁。我们不仅捕获了死锁，还隔离了导致死锁的特定函数。

另一种锁定问题称为**活锁**，其整体效果与死锁相同：活锁会导致系统停滞。在活锁中，两个或多个异步任务被阻塞。然而，与两个或多个异步任务持有锁且不进展不同，这两个或多个异步任务在相互响应但没有进展。一个简单的例子是两个异步任务在一个持续的循环中向对方回应相同的消息。死锁和活锁之间一个经典但清晰的类比是：死锁就像走廊里的两个人站着不动，等待对方移动但谁都不动。而活锁是两个人试图不断地侧身避开对方，但都向错误的方向迈步，导致持续的阻挡，以至于没有人通过。

虽然我们应该不惜一切代价避免死锁，但它们的出现通常很明显，因为系统通常会停滞。然而，我们的代码可能会在不知不觉中默默地导致错误。这就是为什么我们需要测试竞态条件。

### 测试竞态条件

在竞态条件中，数据的状态发生了变化，但对该状态的引用却已过时。数据竞态的一个简单示例如图 11-2 所示。

**图 11-2. 竞态条件**

图 11-2 显示了两个异步任务从数据存储中获取一个数字并将其加一。由于第二个任务在第一个任务更新数据存储之前获取了数据，两个任务都从 10 开始增加，结果是数据变成 11，而它应该是 12。在本书中，我们通过互斥锁或防止数据竞态发生的特定原子操作来防止这种情况。比较并更新原子操作是防止此竞态条件示例发生的最简单方法。然而，尽管防止竞态条件是最好的方法，但如何做到这一点并不总是清晰的，我们需要探索如何测试我们的代码是否存在数据竞态。我们的测试大纲如下：

```rust
#[cfg(test)]
mod tests {
    use std::sync::atomic::{AtomicUsize, Ordering};
    use tokio::time::{sleep, Duration};
    use tokio::runtime::Builder;

    static COUNTER: AtomicUsize = AtomicUsize::new(0);

    async fn unsafe_add() {
        let value = COUNTER.load(Ordering::SeqCst);
        COUNTER.store(value + 1, Ordering::SeqCst);
    }
    #[test]
    fn test_data_race() {
        // ...
    }
}
```

我们没有执行原子加法，而是获取数字，增加数字，然后设置新值，这样我们就有机会出现图 11-2 所示的竞态条件。在我们的测试函数中，我们可以构建一个单线程运行时并生成 10,000 个 `unsafe_add` 任务。在我们处理完这些任务后，我们可以断言 `COUNTER` 为 10,000：

```rust
let runtime = Builder::new_current_thread().enable_all()
    .build()
    .unwrap();

let mut handles = vec![];
let total = 100000;

for _ in 0..total {
    let handle = runtime.spawn(unsafe_add());
    handles.push(handle);
}
for handle in handles {
    runtime.block_on(handle).unwrap();
}
assert_eq!(
    COUNTER.load(Ordering::SeqCst),
    total,
    "race condition occurred!"
);
```

如果我们运行测试，我们会看到它通过了。这是因为运行时只有一个线程，并且在获取和设置之间没有异步操作。但是，假设我们将运行时更改为多线程：

```rust
let runtime = tokio::runtime::Runtime::new().unwrap();
```

我们会得到以下错误：

```
thread 'tests::test_data_race' panicked at 'assertion failed: `(left == right)`
    left: `99410`,
    right: `100000`: race condition occurred!'
```

其中一些任务成为了竞态条件的受害者。假设我们在设置和获取之间放置另一个异步函数，例如睡眠函数：

```rust
let value = COUNTER.load(Ordering::SeqCst);
sleep(Duration::from_secs(1)).await;
COUNTER.store(value + 1, Ordering::SeqCst);
```

我们会得到以下错误：

```
thread 'tests::test_data_race' panicked at 'assertion failed: `(left == right)`
    left: `1`,
    right: `100000`: race condition occurred!'
```

我们所有的任务都成为了竞态条件的受害者。这是因为所有任务最初都读取了 `COUNTER`，在任何一个任务有机会写入之前，因为异步睡眠将控制权交还给了执行器，让其他异步任务读取 `COUNTER`。

如果睡眠是非阻塞的，这种情况也会发生在单线程环境中。这凸显了如果担心竞态条件，需要使用多线程测试环境。我们还可以体会到我们改变任务周围参数的速度，并可以测试参数变化对任务的影响。

我们知道互斥锁和原子值并不是让多个任务访问数据的唯一方法。我们可以使用通道在异步任务之间发送数据。因此，我们需要测试我们的通道容量。

### 测试通道容量

我们在一些示例中使用了无界通道，但有时我们希望限制通道的最大大小以防止过多的内存消耗。然而，如果通道达到其最大限制，发送者就无法向通道发送更多消息。我们可能有一个系统，例如一组参与者，我们需要查看如果我们向系统中发送太多消息，系统是否会堵塞。根据需求，我们可能需要系统在消息全部处理完之前放慢速度，但最好测试系统，以便了解它如何适用于我们的用例。

对于我们的测试，布局如下：

```rust
#[cfg(test)]
mod tests {
    use tokio::sync::mpsc;
    use tokio::time::{Duration, timeout};
    use tokio::runtime::Builder;

    #[test]
    fn test_channel_capacity() {
        // ...
    }
}
```

在我们的测试函数中，我们定义异步运行时和容量为 5 的通道：

```rust
let runtime = Builder::new_current_thread().enable_all()
    .build()
    .unwrap();
let (sender, mut receiver) = mpsc::channel::<i32>(5);
```

然后我们生成一个任务，发送超过通道容量的消息：

```rust
let sender = runtime.spawn(async move {
    for i in 0..10 {
        sender.send(i).await.expect("Failed to send message");
    }
});
```

我们想通过超时测试看看我们的系统是否会崩溃：

```rust
let result = runtime.block_on(async {
    timeout(Duration::from_secs(5), async {
        sender.await.unwrap();
    }).await
});
assert!(result.is_ok(), "A potential filled channel is not handled correctly");
```

现在，我们的测试将失败，因为发送者期物永远不会完成，所以我们的超时被超过了。为了使测试通过，我们需要在超时测试之前放入一个接收者期物：

```rust
let receiver = runtime.spawn(async move {
    let mut i = 0;
    while let Some(msg) = receiver.recv().await {
        assert_eq!(msg, i);
        i += 1;
        println!("Got message: {}", msg);
    }
});
```

现在当我们运行测试时，它通过了。尽管我们测试了一个发送者和接收者的简单系统，但我们必须认识到，我们的测试突出显示了系统会因为未正确处理消息而陷入停滞。通道也可能导致死锁，就像我们的互斥锁一样，如果我们的测试足够充分，超时测试也会突出显示死锁。

正如我们所知，通道使我们能够在系统中异步共享数据。当涉及到跨进程和计算机共享数据时，我们可以使用网络协议。毫无疑问，在实际应用中，你将编写使用协议与服务器交互的异步代码。我们的交互也需要进行测试。

### 测试网络交互

在开发和测试网络交互时，可能会倾向于在本地启动服务器并依赖该服务器。然而，这对测试来说可能不好。例如，如果我们有一个在运行测试后删除服务器上某行的操作，我们就不能立即再次运行它，因为该行已被删除。我们可以构建一个插入该行的步骤，但如果该行有依赖关系，则会变得更加复杂。此外，`cargo test` 命令在多个进程中运行。如果几个测试都访问同一个服务器，我们可能会在服务器上遇到数据竞态条件。这时我们使用 `mockito`。这个 crate 使我们能够直接在测试中模拟服务器，并断言服务器端点是以某些参数调用的。对于我们的网络测试示例，我们需要以下依赖项：

```toml
[dependencies]
tokio = { version = "1.34.0", features = ["full"] }
reqwest = { version = "0.11.22", features = ["json"] }

[dev-dependencies]
mockito = "1.2.0"
```

我们的测试大纲如下：

```rust
#[cfg(test)]
mod tests {
    use tokio::runtime::Builder;
    use mockito::Matcher;
    use reqwest;
    #[test]
    fn test_networking() {
        // ...
    }
}
```

在我们的测试函数中，我们启动测试服务器：

```rust
let mut server = mockito::Server::new();
let url = server.url();
```

这里，`mockito` 会查找计算机上当前未使用的端口。如果我们向该 URL 发送请求，我们的模拟服务器可以跟踪它们。记住，我们的服务器位于测试函数的范围内，因此测试完成后，模拟服务器将被终止。使用 `mockito`，我们的测试保持真正的原子性。

然后我们定义一个服务器端点的模拟：

```rust
let mock = server.mock("GET", "/my-endpoint")
    .match_query(Matcher::AllOf(vec![
        Matcher::UrlEncoded("param1".into(), "value1".into()),
        Matcher::UrlEncoded("param2".into(), "value2".into()),
    ]))
    .with_status(201)
    .with_body("world")
    .expect(5)
    .create();
```

我们的模拟有端点 `/my-endpoint`。我们的模拟还期望 URL 中有某些参数。我们的模拟将返回响应代码 `201` 和主体 `world`。我们还期望我们的服务器被命中五次。如果需要，我们可以添加更多端点，但在此示例中，我们只使用一个以避免章节内容膨胀。

现在我们的模拟服务器已构建，我们定义运行时环境：

```rust
let runtime = Builder::new_current_thread()
    .enable_io()
    .enable_time()
    .build()
    .unwrap();
let mut handles = vec![];
```

一切准备就绪，因此我们向运行时发送五个异步任务：

```rust
for _ in 0..5 {
    let url_clone = url.clone();
    handles.push(runtime.spawn(async move {
        let client = reqwest::Client::new();
        client.get(&format!(
            "{}/my-endpoint?param1=value1&param2=value2",
            url_clone)).send().await.unwrap()
    }));
}
```

最后，我们可以阻塞线程等待异步任务完成，然后断言模拟：

```rust
for handle in handles {
    runtime.block_on(handle).unwrap();
}
mock.assert();
```

我们可以断言所有异步任务都成功命中了服务器。如果我们的一个任务不成功，测试将失败。

在定义请求的 URL 时，最好使用动态定义而不是硬编码。这使我们能够根据我们是向实时服务器、本地服务器还是模拟服务器发出请求来更改 URL 的主机。使用环境变量很诱人。然而，在 `cargo test` 的多线程环境中，这可能会导致问题。相反，最好定义一个提取配置变量的 trait。然后我们传入实现此提取配置变量 trait 的结构体。在将视图函数绑定到实时服务器时，我们可以传入一个从环境变量提取配置变量的结构体。然而，我们也可以在测试对其他服务器进行调用的函数和视图时，将 `mockito` URL 传递给提取配置变量 trait 的实现。

`mockito` 还有更多功能。例如，JSON 主体、确定请求响应的函数以及其他特性在阅读 `mockito` 的 API 文档时可用。现在我们可以模拟服务器和 trait，我们可以在隔离的环境中测试我们的系统。但是，隔离期物并测试这些期物，检查轮询之间期物的状态呢？这就是异步测试 crate 可以为我们提供帮助的地方。

### 细粒度的期物测试

在本节中，我们将使用 Tokio 测试工具。然而，这里涵盖的概念可以应用于在任何异步运行时测试期物。对于我们的测试，我们需要以下依赖项：

```toml
[dependencies]
tokio = { version = "1.34.0", features = ["full"] }

[dev-dependencies]
tokio-test = "0.4.3"
```

对于我们的细粒度测试，我们将让两个期物获取同一个互斥锁，将计数增加一，然后完成。由于两个期物通过获取同一个互斥锁存在间接交互，我们可以单独轮询期物，并确定期物在轮询时的状态。

最初，我们的测试有以下布局：

```rust
#[cfg(test)]
mod tests {
    use tokio::sync::Mutex;
    use tokio::time::{sleep, Duration};
    use tokio_test::{task::spawn, assert_pending};
    use std::sync::Arc;
    use std::task::Poll;

    async fn async_mutex_locker(mutex: Arc<Mutex<i32>>) -> () {
        let mut lock = mutex.lock().await;
        *lock += 1;
        sleep(Duration::from_millis(1)).await;
    }
    #[tokio::test]
    async fn test_monitor_file_metadata() {
        // ...
    }
}
```

在我们的测试中，我们使用期物的引用定义互斥锁：

```rust
let mutex = Arc::new(Mutex::new(0));
let mutex_clone1 = mutex.clone();
let mutex_clone2 = mutex.clone();
```

现在我们可以使用 `tokio_test::spawn` 函数通过互斥锁引用生成期物：

```rust
let mut future1 = spawn(async_mutex_locker(mutex_clone1));
let mut future2 = spawn(async_mutex_locker(mutex_clone2));
```

然后我们轮询我们的期物，断言两者都应该是待定的：

```rust
assert_pending!(future1.poll());
assert_pending!(future2.poll());
```

虽然两个期物都是待定的，但我们知道第一个期物将首先获取互斥锁，因为它首先被轮询。我们可以交换轮询的顺序，我们会得到相反的效果。在这里，我们可以看到这种测试方法的力量。它使我们能够检查如果改变轮询顺序，期物会发生什么。然后我们可以在更深层次上测试边缘情况，因为除非我们特意设计我们的系统这样做，否则我们无法确保实时系统中轮询的顺序。

正如我们在死锁示例中看到的，只要我们的第一个期物获取了互斥锁的锁，我们知道无论我们轮询第二个期物多少次，第二个期物将始终是待定的。我们确保我们的假设正确如下：

```rust
for _ in 0..10 {
    assert_pending!(future2.poll());
    sleep(Duration::from_millis(1)).await;
}
```

在这里，我们可以看到使用 `assert_pending` 宏，如果我们的假设不正确，我们的测试将失败。足够的时间已经过去，所以我们可以假设如果我们现在轮询第一个期物，它将准备就绪。我们定义以下断言：

```rust
assert_eq!(future1.poll(), Poll::Ready(()));
```

然而，我们没有丢弃第一个期物，并且在整个期物过程中我们都没有释放锁。因此，我们可以得出结论，即使我们等待足够第二个期物完成的时间，第二个期物仍然会是待定的，因为第一个期物仍然持有互斥锁守卫。我们可以用这段代码断言这个假设：

```rust
sleep(Duration::from_millis(3)).await;
assert_pending!(future2.poll());
```

我们可以通过丢弃第一个期物、等待，然后断言第二个期物现在已完成，来验证我们关于持有互斥锁的理论是正确的：

```rust
drop(future1);
sleep(Duration::from_millis(1)).await;
assert_eq!(future2.poll(), Poll::Ready(()));
```

然后我们可以断言我们的互斥锁具有我们期望的值：

```rust
let lock = mutex.lock().await;
assert_eq!(*lock, 2);
```

如果我们运行测试，我们会看到它将通过。

在这里，我们设法冻结了异步系统，检查了状态，然后再次轮询，一步一步地推进我们的期物。我们甚至可以在测试中随时交换轮询的顺序。这为我们测试轮询顺序改变时的结果提供了很大的能力。

### 总结

我们涵盖了一系列针对异步问题的测试方法，采用了测试驱动的方法。我们强烈建议，如果你正在开始一个新的异步 Rust 项目，你应该在编写异步代码的同时构建测试。你将因此保持快速的开发节奏。

现在，我们共同的旅程即将结束。我们希望你对使用异步 Rust 感到兴奋。这是一个强大且不断发展的领域。凭借你的新技能和异步知识，你现在拥有了可以用于解决问题的另一个工具。你可以将问题分解为异步概念，并实现强大、快速的解决方案。我们希望你体验到了异步之美以及 Rust 实现异步系统的方式带来的喜悦。说实话，我们对你会用异步 Rust 构建什么感到兴奋。