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