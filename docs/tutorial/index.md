## Rust 的变量及其遮蔽机制

变量默认是不可变的，但可以通过 `let` 关键字重新绑定一个变量名来实现变量的遮蔽（shadowing）。遮蔽允许你在同一作用域内使用相同的变量名，而不会引起冲突。

```rust
fn main() {
    let x = 5;
    println!("The value of x is: {}", x); // 输出 5

    let x = x + 1; // 这里的 x 遮蔽了外层的 x
    println!("The value of x is: {}", x); // 输出 6

    {
        let x = x * 2; // 这里的 x 遮蔽了外层的 x
        println!("The value of x in the inner scope is: {}", x); // 输出 12
    }

    println!("The value of x is: {}", x); // 输出 6，外层的 x 没有被改变
}
```

## Rust 的整型字面值写法

可以直接在数字后指定类型后缀来定义整型字面值：例如 `42u8`、`42i32`、`42isize` 等。

允许使用下划线来分隔数字以提高可读性，例如 `1_000_000`。

## 整型溢出

Rust 在编译时会检查整型溢出，并在发现溢出时抛出错误。在运行时，如果启用了 `debug` 模式，Rust 会在发生溢出时 panic；如果在 `release` 模式下，Rust 会进行环绕（wrapping）操作。

## 浮点型

所有的浮点型都是有符号的。

## 数学运算

整数除法会向零舍入到最接近的整数。

```rust
fn main() {
    let truncated = -5 / 3; // 结果为 -1
}
```

## 字符类型

用单引号声明 char 字面值，而与之相反的是，使用双引号声明字符串字面值。

## 复合类型：元组与数组

元组是一个将多个不同类型的值组合进一个复合类型的主要方式。元组长度固定：一旦声明，其长度不会增大或缩小。

我们使用包含在圆括号中的逗号分隔的值列表来创建一个元组。

使用 let 解构元组，它将一个元组拆成了若干部分，这样我们就可以将元组的各个部分绑定到不同的变量上。

```rust
fn main() {
    let tup = (500, 6.4, 1);

    let (x, y, z) = tup; // 解构元组

    println!("The value of y is: {y}");
}
```

也可以使用点号（.）后跟值的索引来直接访问所需的元组元素。

```rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);

    let five_hundred = x.0;

    let six_point_four = x.1;

    let one = x.2;
}
```

不带任何值的元组有个特殊的名称，叫做单元（unit）元组。这种值以及对应的类型都写作 `()`。如果表达式不返回任何其他值，则会隐式返回单元值。

Rust 中的数组长度是固定的。我们将数组的值写成在方括号内，用逗号分隔的列表，例如 `[1, 2, 3]`。

当你确定元素个数不会改变时，数组会很有用。但是数组并不如 vector 类型灵活。vector 类型是标准库提供的一个 允许 增长和缩小长度的类似数组的集合类型。当不确定是应该使用数组还是 vector 的时候，那么很可能应该使用 vector。

创建每个元素都相同的数组可以通过在方括号中指定初始值加分号再加元素个数的方式来实现，例如 `[3; 5]` 表示创建一个包含 5 个值为 3 的元素的数组。

当尝试用索引访问一个元素时，Rust 会检查指定的索引是否小于数组的长度。如果索引超出了数组长度，Rust 会 panic。

## 函数

Rust 代码中的函数和变量名使用 snake case 规范风格。在 snake case 中，所有字母都是小写并使用下划线分隔单词。

Rust 不关心函数定义所在的位置，只要函数被调用时出现在调用之处可见的作用域内就行（也就是说函数定义可以在调用该函数之后再进行）。

当函数拥有参数（形参）时，可以为这些参数提供具体的值（实参）。在函数签名中，必须声明每个参数的类型。当定义多个参数时，使用逗号分隔。

```rust
fn main() {
    print_labeled_measurement(5, 'h');
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {value}{unit_label}");
}
```

## 语句与表达式

函数定义也是语句，调用函数并不是语句。语句不返回值，因此不能把 let 语句赋值给另一个变量。


函数调用是一个表达式。宏调用是一个表达式。用大括号创建的一个新的块作用域也是一个表达式。表达式会计算出一个值。表达式的结尾没有分号。如果在表达式的结尾加上分号，它就变成了语句，而语句不会返回值。

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1 // 注意这里没有分号
    };

    println!("The value of y is: {y}");
}
```

函数可以向调用它的代码返回值。我们并不对返回值命名，但要在箭头（->）后声明它的类型。在 Rust 中，函数的返回值等同于函数体最后一个表达式的值。使用 return 关键字和指定值，可从函数中提前返回；但大部分函数隐式的返回最后的表达式。

```rust
fn five() -> i32 {
    5
}

fn main() {
    let x = five(); // 等同于 let x = 5;

    println!("The value of x is: {x}");
}
```

## 控制流

### if 表达式

所有的 if 表达式都以 if 关键字开头，其后跟一个条件。代码中的条件必须是 bool 值。

可以将 else if 表达式与 if 和 else 组合来实现多重条件。

因为 if 是一个表达式，我们可以在 let 语句的右侧使用它。

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {number}"); // The value of number is: 5
}
```

if 的每个分支的可能的返回值都必须是相同类型，如果它们的类型不匹配，则会出现一个错误。

```rust
fn main() {
    let condition = true;

    let number = if condition { 5 } else { "six" }; // 错误：if 和 else 分支的类型不匹配

    println!("The value of number is: {number}");
}
```

### 循环

Rust 有三种循环：loop、while 和 for。

loop 关键字告诉 Rust 一遍又一遍地执行一段代码直到你明确要求停止。使用 break 关键字来告诉程序何时停止循环。continue 关键字告诉程序跳过这个循环迭代中的任何剩余代码，并转到下一个迭代。

可以在用于停止循环的 break 表达式后添加你希望返回的值，这个值就会作为循环的返回值返回。

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2; // counter * 2 作为循环的返回值
        }
    };

    println!("The result is {result}"); // The result is 20
}
```

如果存在嵌套循环，break 和 continue 默认应用于此时最内层的循环。可以选择在一个循环上指定一个循环标签（loop label），然后将标签与 break 或 continue 一起使用，这样可以应用在指定循环上。

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop { // 外层循环 counting_up
        println!("count = {count}");
        let mut remaining = 10;

        loop { // 内层循环
            println!("remaining = {remaining}");
            if remaining == 9 {
                break; // 退出内层循环
            }
            if count == 2 {
                break 'counting_up; // 退出外层循环
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

while 条件循环：当条件为 true，执行循环。当条件不再为 true，循环结束。

除此以外，还可以使用 while 结构遍历集合中的元素，比如数组。

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;

    while index < 5 {
        println!("the value is: {}", a[index]);

        index += 1;
    }
}
```

相比于 while 循环，更推荐使用 for 循环来遍历集合中的元素，因为 for 循环更简洁且不易出错。

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```

for 循环的优势之一是可以使用 Range，它是标准库提供的类型，用来生成从一个数字开始到另一个数字之前结束的所有数字的序列。可以使用 rev来反转这个序列。

```rust
fn main() {
    for number in 1..4 {
        println!("{number}!"); // 输出 1! 2! 3!
    }

    for number in (1..4).rev() {
        println!("{number}!"); // 输出 3! 2! 1!
    }
}
```

## 所有权

所有权（ownership）是 Rust 用于如何管理内存的一组规则。

栈和堆都是代码在运行时可供使用的内存，但是它们的结构不同。栈遵循后进先出的原则，栈中的所有数据都必须占用已知且固定的大小。而堆是缺乏组织的，向堆放入数据时，你要请求一定大小的空间。内存分配器（memory allocator）在堆的某处找到一块足够大的空位，把它标记为已使用，并返回一个表示该位置地址的指针，该过程称作在堆上分配内存（allocating on the heap），有时简称为 “分配”（allocating）。（将数据推入栈中并不被认为是分配）。入栈比在堆上分配内存要快，访问堆上的数据比访问栈上的数据慢。所有权的主要目的就是管理堆数据。

所有权的规则如下：

1. Rust 中的每一个值都有一个所有者（owner）。
2. 值在任一时刻有且只有一个所有者。
3. 当所有者离开作用域，这个值将被丢弃。

作用域是一个项（item）在程序中有效的范围。变量从声明的点开始直到当前作用域结束时都是有效的。当变量离开作用域后，Rust 自动调用 drop 函数并清理变量的堆内存。

字符串字面值是不可变的，并不适合使用文本的每一种场景。Rust 有另一种字符串类型：String。这个类型管理被分配到堆上的数据，能够存储在编译时未知大小的文本。可以使用 from 函数基于字符串字面值来创建 String。

```rust
let mut s = String::from("hello");

s.push_str(", world!"); // push_str() 在字符串后追加字面值

println!("{s}"); // 输出 "hello, world!"
```

多个变量可以采取不同的方式与同一数据进行交互。例如

```rust
let x = 5;
let y = x;
```

这里因为整数是有已知固定大小的简单值，x 的值拷贝到 y 中，这两个 5 都被压入了栈中。但下面的情况不同：

```rust
let s1 = String::from("hello");
let s2 = s1;
// println!("{}, world!", s1); // 这里会报错，因为 s1 的所有权被移动到 s2
```

第一条语句实际上发生了如下的事情：指向存放字符串内容内存的指针、长度和容量这一组数据存储在栈上，堆上存放内容 hello。

```
         s1
+----------+-------+       +-------+-------+
|   name   | value |       | index | value |
+----------+-------+       +-------+-------+
|   ptr    |   ----------> |   0   |   h   |
+----------+-------+       +-------+-------+
|   len    |   5   |       |   1   |   e   |
+----------+-------+       +-------+-------+
| capacity |   5   |       |   2   |   l   |
                           +-------+-------+
                           |   3   |   l   |
                           +-------+-------+
                           |   4   |   o   |
                           +-------+-------+
```

将 s1 赋值给 s2 时，Rust 从栈上拷贝了它的指针、长度和容量，但并没有复制指针指向的堆上数据。由于当 s2 和 s1 离开作用域时，它们都会尝试释放相同的内存。两次释放（相同）内存会导致内存污染，可能导致潜在的安全漏洞。为了确保内存安全，在 let s2 = s1; 之后，Rust 认为 s1 不再有效，因此无法使用 s1。这个行为被称为移动（move）。

由于任何值在任一时刻有且只有一个所有者，这里相当于 s1 的所有权被移动到了 s2。

Rust 永远也不会自动创建数据的 “深拷贝”（拷贝指针、长度和容量，而且拷贝数据本身）。如果确实需要深拷贝，可以使用 String 类型的 clone 方法。

```rust
let s1 = String::from("hello");
let s2 = s1.clone(); // 不光拷贝栈上的数据，还拷贝了堆上的数据

println!("s1 = {s1}, s2 = {s2}");
```

如果一个类型实现了 Copy trait，那么一个旧的变量在将其赋值给其他变量后仍然有效。类似整型这样的存储在栈上的类型都实现了 Copy trait。

向函数传递值可能会移动或者复制，就像赋值语句一样。

```rust
fn main() {
    let s = String::from("hello");  // s 进入作用域

    takes_ownership(s);             // s 的值移动到函数里 ...
    // println!("{}", s); 这里会报错，因为 s 的所有权被移动了

    let x = 5;                      // x 进入作用域

    makes_copy(x);                  // x 应该移动到函数里，但由于 i32 是 Copy 的类型
    println!("{}", x);              // 所以在后面可继续使用 x

} // 这里，应该是 x 先移出了作用域，然后是 s。但因为 s 的值已被移走，因此没有特殊之处

fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{some_string}");
} // 这里，some_string 移出作用域并调用 `drop` 方法。

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{some_integer}");
} // 这里，some_integer 移出作用域。没有特殊之处
```

返回值也可以转移所有权。

```rust
fn main() {
    let s1 = gives_ownership();        // gives_ownership 将它的返回值传递给 s1

    let s2 = String::from("hello");    // s2 进入作用域

    let s3 = takes_and_gives_back(s2); // s2 被传入 takes_and_gives_back，它的返回值又传递给 s3
} // 此处，s3 移出作用域并被丢弃。s2 被 move，s1 移出作用域并被丢弃

fn gives_ownership() -> String { // gives_ownership 将会把返回值传入调用它的函数
    let some_string = String::from("yours"); // some_string 进入作用域
    some_string // 返回 some_string 并将其移至调用函数
}

// 该函数将传入字符串并返回该值
fn takes_and_gives_back(a_string: String) -> String {
    // a_string 进入作用域
    a_string  // 返回 a_string 并移出给调用的函数
}
```

### 引用与借用

Rust 提供了一个不用获取所有权就可以使用值的功能，叫做引用（references）。引用像一个指针，因为它是一个地址，我们可以由此访问储存于该地址的属于其他变量的数据。但与指针不同，引用在其生命周期内保证指向某个特定类型的有效值。用符号 & 来表示引用。将创建一个引用的行为称为借用（borrowing）。

当函数使用引用而不是实际值作为参数，无需返回值来交还所有权，因为就不曾拥有所有权。

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1); // 传入一个指向值 s1 的引用，但是并不拥有它

    println!("The length of '{s1}' is {len}.");
}

fn calculate_length(s: &String) -> usize { // s 是 String 的引用
    s.len()
} // s 在这里离开作用域，但因为它并不拥有引用的值的所有权，所以什么也不会发生
```

正如变量默认是不可变的，引用也一样。（默认）不允许修改引用的值。但是可以通过可变引用（mutable reference）让我们修改引用指向的值。

```rust
fn main() {
    let mut s = String::from("hello"); // s 必须是可变的

    change(&mut s); // 传入 s 的可变引用
}

fn change(some_string: &mut String) { // some_string 是 String 的可变引用
    some_string.push_str(", world"); // 修改引用指向的值
}
```

可变引用有很大的限制：如果你有一个对该变量的可变引用，你就不能再创建对该变量的引用。也不能在拥有不可变引用的同时拥有可变引用。然而，多个不可变引用是可以的，因为不可变引用只能读取数据，不会影响其他引用者读取到的数据。这一限制以一种非常小心谨慎的方式允许可变性，防止同一时间对同一数据存在多个可变引用。好处是 Rust 可以在编译时就避免数据竞争（data race）。

```rust
let mut s = String::from("hello");

let r1 = &s; // 没问题
let r2 = &s; // 没问题
let r3 = &mut s; // 编译错误，因为不能在拥有不可变引用的同时拥有可变引用
```

一个引用的作用域从声明的地方开始一直持续到最后一次使用为止。编译器可以在作用域结束之前判断不再使用的引用。

```rust
let mut s = String::from("hello");

let r1 = &s; // 没问题
let r2 = &s; // 没问题
println!("{r1} and {r2}"); // 这是最后一次使用 r1 和 r2
// 此位置之后 r1 和 r2 不再使用，所以它们的作用域到此结束

let r3 = &mut s; // 虽然不能在拥有不可变引用的同时拥有可变引用，但是这里不会发生编译错误
println!("{r3}");
```

在 Rust 中编译器确保引用永远也不会变成悬垂引用：当你拥有一些数据的引用，编译器确保数据不会在其引用之前离开作用域。

```rust
fn dangle() -> &String { // dangle 函数返回一个字符串的引用
    let s = String::from("hello"); // s 是一个新字符串

    &s // 返回字符串 s 的引用
} // 这里 s 离开作用域并被丢弃，其内存被释放。编译错误，因为它试图返回一个指向已被释放内存的引用
```

综上，在任意给定时间，要么只能有一个可变引用，要么只能有多个不可变引用。引用必须总是有效的。

### 切片（Slice）

切片（slice）允许你引用集合中一段连续的元素序列，而不用引用整个集合。slice 是一种引用，所以它不拥有所有权。

字符串 slice（string slice）是 String 中一部分值的引用，它看起来像这样：

```rust
let s = String::from("hello world");

let hello = &s[0..5]; // 从索引 0 开始时，也可以不写两个点号之前的值，即 &s[..5]
let world = &s[6..11]; // 到最后一个字节结束时，也可以不写两个点号之后的值，即 &s[6..]
// 整个字符串 slice 可以省略两头的值，写作 &s[..]
```

此时的切片结构如下：

```
         s
+----------+-------+      +-------+-------+
|   name   | value |      | index | value |
+----------+-------+      +-------+-------+
|   ptr    |   ----------->   0   |   h   |
+----------+-------+      +-------+-------+
|   len    |   11  |      |   1   |   e   |
+----------+-------+      +-------+-------+
| capacity |   11  |      |   2   |   l   |
+----------+-------+      +-------+-------+
                          |   3   |   l   |
                          +-------+-------+
       world              |   4   |   o   |
+----------+-------+      +-------+-------+
|   name   | value |      |   5   |       |
+----------+-------+      +-------+-------+
|   ptr    |   ----------->   6   |   w   |
+----------+-------+      +-------+-------+
|   len    |   5   |      |   7   |   o   |
+----------+-------+      +-------+-------+
                          |   8   |   r   |
                          +-------+-------+
                          |   9   |   l   |
                          +-------+-------+
                          |  10   |   d   |
                          +-------+-------+
```

字符串 slice range 的索引必须位于有效的 UTF-8 字符边界内，如果尝试从一个多字节字符的中间位置创建字符串 slice，则程序将会因错误而退出。

字符串字面值实际是一个指向二进制程序特定位置的 slice，类型是 &str，因此字符串字面值是不可变的，因为 &str 是一个不可变引用。

字符串 slice 作为参数可以接收 String 或 &str，因为它们都可以被视为字符串 slice。

除了字符串切片（&str），还可以创建数组切片。

```rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..4]; // 创建一个指向数组 a 中元素 2、3、4 的切片
// 这个 slice 的类型是 &[i32]，它会存储第一个集合元素的引用和一个集合总长度
assert_eq!(slice, &[2, 3]); // 断言 slice 的值是否等于 &[2, 3]
```

## 结构体

结构体（struct 或 structure），是一种自定义数据类型，允许你包装和命名多个相关的值，从而形成一个有意义的组合。

和元组一样，结构体的每一部分可以是不同类型。但不同于元组，结构体需要命名各部分数据以便能清楚的表明其值的意义。因此，结构体不需要依赖顺序来指定或访问实例中的值。

定义结构体时，需要使用 struct 关键字并为整个结构体命名。在后面的花括号中，定义每一部分数据的名字和类型，我们称为字段（field）。

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
} // 如果在函数体内定义结构体，结尾处需要加分号

struct User_updated {
    active: mut bool, // 报错，不能在定义结构体时将某个字段标记为 mut
    username: String,
    email: String,
    sign_in_count: u64,
}
```

一旦定义了结构体，为了使用它，需要创建这个结构体的实例。创建实例时以结构体的名字开头，接着在花括号中使用 key: value 的形式提供字段。不能在定义结构体时将任一字段标记为 mut。

默认情况下，实例是不可变的。若整个实例是可变的，则各个字段均为可变。

```rust
let user1 = User { // 创建一个 User 结构体的不可变实例 user1
    active: true,
    username: String::from("example_user"),
    email: String::from("user1@example.com"),
    sign_in_count: 1, // 各个字段的顺序无关紧要
};

user1.email = String::from("user1_updated@example.com"); // 报错，user1 是不可变实例，无法修改字段

let mut user2 = User { // 创建一个 User 结构体的可变实例 user2
    active: true,
    username: String::from("another_user"),
    email: String::from("user2@example.com"),
    sign_in_count: 2,
};

user2.email = String::from("user2_updated@example.com"); // user2 是可变实例，可以修改字段
```

函数可以返回结构体的实例，这可以通过在最后一个表达式中构造一个结构体的新实例来隐式返回它。如果函数的参数名与字段名都完全相同，可以使用字段初始化简写语法（field init shorthand）

```rust
fn build_user(email: String, username: String) -> User { //函数参数名与 User 字段名相同
    User {
        active: true,
        username, // 等价于 username: username,
        email, // 等价于 email: email,
        sign_in_count: 1,
    }
}
```

可以借助其他已有实例来创建新的实例，这种语法叫做结构体更新语法（struct update syntax）。使用 `已有实例.字段名` 语法来使用其他实例的字段值；使用 `..已有实例名` 语法来复制另一实例的其余字段值，注意此时必须放在最后。

```rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("username1"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    let user2 = User {
        active: user1.active, // 从 user1 复制 active 字段
        username: String::from("username2"),
        email: String::from("user2@example.com"),
        sign_in_count: user1.sign_in_count, // 从 user1 复制 sign_in_count 字段
    };

    let user3 = User {
        email: String::from("user3@example.com"),
        ..user1 // 表示 user3 的其余字段与 user1 相同
    };
}
```

由于以上两种方式会将字段值从旧实例移动到新实例（相当于 `=` 赋值），因此如果旧实例的某个字段值没有实现 Copy trait，则旧实例的该字段将不再有效。

```rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("username1"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    let user2 = User {
        username: String::from("username2"), // 这是新的 username 字段，不会影响 user1.username
        ..user1 // 这里会发生所有权的移动
    };

    println!("{}", user1.username); // 不会报错，因为 user2 创建了新的 username 字段

    println!("{}", user2.email); // user2 的 email 字段值为 "someone@example.com"

    println!("{}", user1.email); // 报错，user1 的 email 字段值已被移动到 user2

    println!("{}", user1.sign_in_count); // 不会报错，因为 sign_in_count 实现了 Copy trait，所以值被复制而不是被移动
}
```

你可以继续访问那些所有权未被移动的字段，但你不能再访问那些所有权已经被移动的字段。并且你不能再将旧实例作为一个整体来使用（例如 `let user4 = user1;`）。

可以使结构体存储被其他对象拥有的数据的引用，不过这么做的话需要指定生命周期（lifetimes）。生命周期确保结构体引用的数据有效性跟结构体本身保持一致。如果你尝试在结构体中存储一个引用而不指定生命周期将是无效的。

```rust
struct User {
    active: bool,
    username: &str, // 报错，结构体中存储了一个引用，但没有指定生命周期
    email: &str, // 报错，结构体中存储了一个引用，但没有指定生命周期
    sign_in_count: u64,
}
```

### 元组结构体（tuple structs）

当你想给整个元组取一个名字，并使元组成为与其他元组不同的类型时，元组结构体是很有用的。元组结构体有着结构体名称，但没有具体的字段名，只有字段的类型。

定义元组结构体时，以 struct 关键字和结构体名开头，后跟元组中的类型。

元组结构体实例类似于元组，你可以将它们解构为单独的部分，也可以使用 `.索引` 来访问单独的值。与元组不同的是，解构元组结构体时必须写明结构体的类型。

```rust
fn main() {
    struct Point(i32, i32, i32);
    struct Color(i32, i32, i32); // 定义两个元组结构体 Point 和 Color

    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0); // 创建 Point 和 Color 的实例
    // 即使它们的字段类型和数量相同，它们仍然是不同的类型

    let (x, y, z) =  origin; // 报错，必须写明结构体的类型
    let Point(x, y, z) = origin; // 不会报错，解构 Point 结构体实例

    println!("{}", origin.0); // 使用 `.索引` 访问字段值
}
```

类单元结构体（unit-like structs）是一个没有任何字段的结构体。它们类似于 `()` 类型。类单元结构体常常在你想要在某个类型上实现 trait 但不需要在类型中存储数据的时候发挥作用。定义和实例化类单元结构体的语法极其简单，不需要花括号或圆括号。

```rust
struct AlwaysEqual; // 定义一个类单元结构体 AlwaysEqual

fn main() {
    let subject = AlwaysEqual; // 创建 AlwaysEqual 的实例
}
```

### 方法

方法（method）与函数类似：它们都使用 fn 关键字和名称声明，可以拥有参数和返回值，同时包含在某处调用该方法时会执行的代码。不过方法与函数也有不同，方法在结构体的上下文中被定义，或者是枚举或 trait 对象的上下文被定义，而且第一个参数总是 `self` ——代表调用该方法的结构体实例。

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle { // 为 Rectangle 结构体定义方法
    fn area(&self) -> u32 { // 方法的第一个参数是 &self，self 代表当前 impl 块类型（即 Rectangle）的实例
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area() // 采用方法语法（method syntax）调用 Rectangle 的 area 方法
    );
}
```

这里，使用一个 impl 块来定义 Rectangle 结构体的方法，这个 impl 块中的所有内容都将与 Rectangle 类型相关联。`&self` 实际上是 `self: &Self` 的缩写。在一个 `impl` 块中，`Self` 类型是 `impl` 块的类型的别名。方法的第一个参数必须有一个名为 `self` 的 `Self` 类型的参数，只能用 `self` 这个名字来简化。

之所以选择 `&self` 是因为我们并不想获取所有权，只希望能读取结构体中的数据，而不是写入。如果想要在方法中改变调用方法的实例，需要将第一个参数改为 `&mut self`。

方法的名称可以与结构体其中一个字段名相同。Rust 能区分何时调用方法（加圆括号），何时访问字段（不加圆括号）。

每个结构体都允许拥有多个 `impl` 块。

```rust
impl Rectangle {
    fn width(&self) -> bool { // 方法名称与某一字段名称 width 相同
        self.width > 0
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    if rect1.width() { //这里调用 width 方法返回的布尔值
        println!("The rectangle has a nonzero width; it is {}", rect1.width); // 这里访问 width 字段的值
    }
}
```

Rust 具备自动引用和解引用（automatic referencing and dereferencing）的功能，方法调用是少数几种体现这种功能的地方之一。例如创建一个 `Rectangle` 实例 `rect1` 后再通过 `let rect = &rect1;` 来创建一个指向 `rect1` 的引用，此时能直接使用 `rect.area()` 来调用 `area` 方法，而不需要写成 `(*rect).area()`。Rust 会自动为我们添加解引用操作符。同理，Rust 还会自动添加 `&`、`&mut` 以便与方法签名匹配。

### 关联函数

所有在 `impl` 块中定义的函数被称为关联函数（associated functions），因为它们与 `impl` 后面的类型相关。我们可以定义不以 `self` 为第一参数的关联函数（因此就不是方法），因为它们并不作用于一个结构体的实例，而是作用于整个结构体类型。要调用这种关联函数，我们使用 `结构体名::关联函数名` 语法。

不是方法的关联函数经常被用作是返回一个结构体新实例的构造函数。它们总是被命名为 `new`，因为 `new` 不是关键字，可以作为函数名。

```rust
impl Rectangle {
    fn square(size: u32) -> Self { // 由于不以 self 为第一参数，它不是方法而是关联函数
        Self {
            width: size,
            height: size,
        } // 返回一个新的 Rectangle 实例，表明其作为构造函数的身份
    }
}

fn main() {
    let sq = Rectangle::square(3); // 调用关联函数 square，这里作为构造函数返回一个 Rectangle 实例

    println!(
        "The area of the square is {} square pixels.",
        sq.area()
    );
}
```

关键字 `Self` 在函数的返回类型和函数体中，都是对 `impl` 关键字后所示类型的别名。

## 枚举

结构体给予你将字段和数据聚合在一起的方法，而枚举给予你一个途径去声明某个值是一个集合中的一员。