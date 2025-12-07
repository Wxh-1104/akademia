# Web开发技术

## WEB基础知识

### 软件开发架构

*   软件开发时，通常会在C/S（Client/Server）和B/S（Browser/Server）两种基本架构中进行选择。
    *   C/S为客户端与服务器之间的交互架构
    *   B/S为浏览器与服务器之间的交互架构

### C/S架构

*   C/S 架构是一种早期出现的软件架构，它主要分为客户机和服务器两层
*   用户在使用软件前需要先下载一个客户端，安装后才能使用
*   C/S架构适合界面丰富、业务逻辑复杂的应用程序，如office、大型游戏软件等。

（此处需结合幻灯片中的C/S架构交互示意图进行讲解：左侧为客户机发送数据请求，右侧为服务器返回数据响应）

*   **缺点:**
    *   每台客户机都需要安装客户端程序，工作量非常巨大。
    *   一旦软件需要升级，则所有客户端的程序都需要改变，维护成本高。
    *   兼容性差，对于不同的开发工具，具有较大的局限性。若采用不同工具，需要重新改写程序。

### B/S架构

*   客户机上无需安装专门的客户端程序，程序中的业务逻辑都集中到了Web服务器上，客户机只需要安装一个浏览器就能与服务器进行交互。

（此处需结合幻灯片中的B/S架构交互示意图进行讲解：左侧浏览器发送HTTP请求，中间服务器处理，右侧数据库交互，最后返回HTTP响应结果）

*   B/S架构无需升级多个客户端，升级服务器即可，使得软件维护简单方便
*   **缺点：**
    *   速度受限制
    *   安全性不高

> **本课程主要讲解B/S架构的软件开发**

### 请求响应模式

*   是Web应用开发的核心思想，用浏览器请求资源，服务端响应资源
*   当浏览器向Web服务器发送一个请求时，Web服务器会对该请求进行处理，并返回相应结果给浏览器，浏览器通过解析服务器返回的内容呈现给用户。

（此处需结合幻灯片中的请求响应循环示意图进行讲解）

*   请求响应模式所涉及的几个重要概念
    *   URL 、 Web资源、Web服务器

### URL

*   放置在Internet上的每一个资源都应该有一个访问标记符，用于唯一标识它的访问位置，这个访问标识符称为URL(Uniform Resource Locator，统一资源定位符)。

```text
http://www.wzu.edu.cn:8080/wd/wg.htm
```

*   URL的一般由三部分组成，分别为**应用层协议**，**服务器的IP或域名加端口号**以及**资源所在的路径**等
    *   上述例子中，“http”表示传输数据所使用的应用层协议
    *   ”www.wzu.edu.cn”表示要请求的服务器主机名（域名），对应IP
    *   8080表示请求的端口号
    *   wd/wg.htm表示资源名

### WEB资源

*   放在Internet上供外界访问的文件或程序被称作Web资源
*   Web资源又可以分为静态Web资源和动态Web资源
    *   静态资源一般由HTML页面构成的，当浏览器在不同时间或者不同条件下访问此类页面时，所获得的内容都不会发生变化（如新闻等）
    *   动态资源表示服务器需要根据用户的需求在不同时刻，不同场景下返回不同的内容。如飞机订票网站、旅游网、股票网等等。
*   在Java web开发中，动态Web资源主要指Servlet，JSP等。（PHP+ ASP）

### WEB服务器

*   不管是静态还是动态Web资源，开发完毕后都需要部署到Web服务器上才能被外界访问。
*   在Java web开发中，由于Apache Tomcat是一款开源、性能优秀的软件服务器，非常适合用作中小型项目的部署和学习使用。
*   Apache Tomcat实质上包含了2种主流的Web服务器，分别为Apache和Tomcat。Apache服务器主要负责静态Web资源的处理和响应，Tomcat主要负责动态Web资源的处理和响应。

（此处需结合幻灯片中的Tomcat服务器内部架构图进行讲解：展示HTTP请求如何经过Apache服务器处理静态资源，或转发给Tomcat服务器/JSP容器处理动态资源并交互数据库）

## WEB开发入门实践

### 安装服务器

官网：http://tomcat.apache.org/

*   下载64-bit Windows zip压缩包，通过解压的方式来安装（8.5.42）
*   下载完毕后，直接解压到指定的目录便可完成Tomcat的安装，需要注意的是，解压的目录最好不要包含中文字符。
*   比如：

（此处需结合幻灯片中的图片讲解：展示Tomcat解压后的文件夹结构，路径为 `D:\apache-tomcat-8.5.4`）

### 目录结构

*   **bin：** 用于存放Tomcat的可执行文件和脚本文件，如tomcat8.exe, startup.bat等。
*   **conf:** 用于存放Tomcat的各种配置文件，如web.xml, server.xml等。
*   **logs:** 用于存放Tomcat的日志文件。
*   **temp:** 用于存放Tomcat运行时产生的临时文件。
*   **webapps:** Web应用程序的主要发布目录，通常将要发布的应用程序发布到这一目录下。
*   **work:** Tomcat的工作目录，JSP编译生成的Servlet源文件和字节码文件放到这个目录下。

### 启动

*   在启动Tomcat前，要确保JDK的环境变量已经正确配置
    *   JAVA_HOME
    *   %JAVA_HOME%\bin

（此处需结合幻灯片中的图片讲解：展示JAVA_HOME环境变量配置界面）

*   另外还需要配置
    *   CATALINA_HOME

（此处需结合幻灯片中的图片讲解：展示CATALINA_HOME环境变量配置界面）

*   配置环境变量后，鼠标双击Tomcat安装目录下bin文件夹中的startup.bat文件，便可启动Tomcat服务器

### 首页面

*   如果在启动过程中没有报异常，说明启动成功。此时在浏览器输入 `http://localhost:8080` 或者 `http://127.0.0.1:8080/`，如果出现图1-11所示界面，则表示Tomcat安装成功。

（此处需结合幻灯片中的图片讲解：展示Tomcat启动成功后的欢迎界面，带有Apache Tomcat Logo和 "If you're seeing this, you've successfully installed Tomcat. Congratulations!" 字样）

### 发布第一个WEB应用

*   Web应用就是多个Web资源的集合，在Java Web应用中，这些资源通常包括html页面、css文件、js文件、动态Web页面、Java程序、依赖的Jar包以及相关配置文件等。
*   开发人员在开发Web应用时，**需要按照一定的目录结构去存放这些文件使得服务器能够管理并对外发布Web应用。**

（此处需结合幻灯片中的图片讲解：展示Web应用的目录层级结构树状图，以及右侧提示文字“这么麻烦？”）

### 先创建一个最简单的Web应用（仅包含一个html文件）

*   在任何目录下创建HelloWebWorld文件夹，然后在HelloWebWorld文件夹下创建welcome.html文件，用记事本打开并写入“Welcome to the world of Java Web!” 。将HelloWebWorld文件夹拷贝到Tomcat安装根路径的Webapps目录下，启动Tomcat（如已启动，则在bin目录下点击shutdown.bat文件先关闭Tomcat），在浏览器地址栏输入 `http://localhost:8080/HelloWebWorld/welcome.html`

（此处需结合幻灯片中的图片讲解：展示浏览器访问成功后的页面，显示文字“Welcome to the world of Java Web!”）

*   因为上述例子客户端和服务端在同一台机器，所以使用的域名为“localhost”。如果当前机器在局域网中，局域网内其它机器只需将上述URL中的“localhost”改为当前主机的IP地址即可访问该Web应用，读者可自行尝试。

### TOMCAT常用配置

*   **修改8080端口**
    *   修改conf文件夹中的server.xml
    
    （此处需结合幻灯片中的图片讲解：展示server.xml中修改 `<Connector port="8080" ...>` 的代码位置）

*   **配置Web应用默认访问页面**
    *   conf文件夹中的web.xml文件中

```xml
<welcome-file-list>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.htm</welcome-file>
    <welcome-file>index.jsp</welcome-file>
    <welcome-file>welcome.html</welcome-file>
</welcome-file-list>
```

**原理：** 其中`<welcome-file-list>`标签用于配置默认页面列表，当访问某一Web应用没有指定具体的资源名称时，Tomcat会根据`<welcome-file-list>`的配置，依次查找默认页面，如果找到就将其返回给用户，如果没有找到，则返回状态码为404的错误提示页面。

### 总结

*   C/S架构和B/S架构
*   URL地址
*   静态Web资源和动态Web资源
*   Web服务器
*   Apache Tomcat的安装和配置
*   发布第一个Web应用

## HTML 基础

### 简介

*   HTML（HyperText Mark-up Language，超文本标记语言）是用来描述网页的一种标记语言，它由一套预先定义好的标记标签所组成。
*   当浏览器解析网页时，会根据标签的不同含义，呈现出不同的效果。

```html
<!--例2-1.html-->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title> 第一个 HTML 案 例
</title>
</head>
<body>
<b>字体加粗</b> </body>
</html>
```

（此处需结合幻灯片中的图片讲解：展示上述代码在浏览器中运行的效果，文字“字体加粗”被加粗显示）

### 开发工具

#### IntelliJ IDEA

（此处需结合幻灯片中的图片讲解：展示IntelliJ IDEA新建项目时的界面，选中Static Web选项）

### 网页的基本结构

*   HTML的基本结构可以分成三个部分，分别为声明部分，头部和主题部分

（此处需结合幻灯片中的图片讲解：展示HTML代码结构的划分图解，`<!DOCTYPE html>`对应声明部分，`<head>...</head>`对应头部，`<body>...</body>`对应主体部分）

*   HTML 5为例：`<!DOCTYPE html>`是关于文档类型的声明，用于约束HTML5文档结构，同时告诉浏览器，**使用哪种规范来解析**此文档中的代码，各个版本的HTML声明部分会有所不同。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
```

### 头部

*   以`<head>`开始，`</head>`结束
*   其中`<title>`标签用于描述网页的标题
*   `<meta>`标签描述的内容并不显示，它主要用于描述网页内容类型、字符编码信息、搜索关键字等。

### 主体部分

*   包含在`<body></body>`之间的内容为网页的主体部分，所有要在页面上显示的内容都要此标签内编写。
*   是学习HTML的**核心**所在
*   **大小写不敏感！**

### 标签格式

*   **双标记**

（此处需结合幻灯片中的图片讲解：展示双标记的结构图，`<p>`是开始标签(Opening tag)，`</p>`是结束标签(Closing tag)，中间是内容(content)）

### 标签格式（续）

*   **单标记**

（此处需结合幻灯片中的图片讲解：展示单标记的结构图，如`<br>`代表换行(Line Break)，`<hr>`代表水平线(Horizontal Rule)，它们只有开始标签）

### 带属性的标记

*   属性值用双引号或单引号括起
*   属性值自身带引号，则外双内单

（此处需结合幻灯片中的图片讲解：展示带属性标签的结构图，以`<p id="myId"></p>`为例，其中`id`是属性名(Attribute name)，`"myId"`是属性值(Attribute value)，强调属性值不能有空格，必须有空格分隔标签名和属性）

## HTML 常见标签

### 基本标签

标题、段落、水平线、换行、字体、特殊符号和注释

### 标题

*   标题的一般形式为`<hn>内容</hn>`，其中n的取值可以为1~6中的整数

```html
<!--例2-3.html-->
<body>
<h1>n=1</h1>
<h2>n=2</h2>
<h3>n=3</h3>
<h4>n=4</h4>
<h5>n=5</h5>
<h6>n=6</h6>
</body>
```

（此处需结合幻灯片中的图片讲解：展示h1到h6在浏览器中显示出的字体大小逐渐变小的效果）

### 段落和换行

段落通过`<p>`标签来定义，换行通过`<br>`标签来定义

```html
<!--例2-4.html-->
<body>
<p>白日依山尽，黄河入海流。
</p>
<p>欲穷千里目，更上一层楼。
</p>
<p>
白日依山尽，黄河入海流。
<br>
欲穷千里目，更上一层楼。
<br>
</p>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器渲染效果，前两句诗分别在不同段落，后两句诗在同一段落但使用了换行符）

### 水平线和字体

水平线标签`<hr>`，常见的设置字体风格的标签有`<b>`, `<u>`, `<i>`, `<sup>`, `<sub>`等，分别表示粗体，下划线，斜体，上标和下标。

```html
<!--例2-5.html-->
<body>
<h3>字体格式</h3>
<hr>
<p>
<b>我爱</b>北京<u>天安门</u>，<br>
<i>天安门</i>上太阳升。<br>
x<sup>2</sup> + x + D<sub>n</sub> = 0
</p>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器渲染效果，包括水平分隔线，粗体“我爱”，下划线“天安门”，斜体“天安门”，以及数学公式 $x^2 + x + D_n = 0$ 的显示）

### 特殊符号和注释

*   诸如大于号（>），小于号（<）等已作为HTML的语法符号，因此需要使用字符实体来表示此类特殊符号
*   `<!--注释内容-->`
*   IDEA中快捷键“Ctrl+Shift+/”

| 特殊符号 | 字符实体 |
| :--- | :--- |
| 空格 | `&nbsp;` |
| 大于号（>） | `&gt;` |
| 小于号（<） | `&lt;` |
| 引号（"） | `&quot;` |
| 版权符号 | `&copy;` |

```html
<!--例2-6.html-->
<body>
Copyright&copy;2019
HuaWei Inc.&nbsp; <br>
reserved all rights. <br>
&lt;京ICP备10022233
&gt; &quot;China&quot; <br>
</body>
```

（此处需结合幻灯片中的图片讲解：展示特殊符号在浏览器中正确渲染的结果）

### 图片标签

*   `<img src=”路径” alt=”替代文本” title=”鼠标悬停提示文字” width=”宽度” height=”高度” />`
*   src属性表示图片路径（绝对和相对路径）
    *   绝对路径通常用来表示资源的完整URL地址
    
    ```html
    <body>
        <img
        src="http://pic25.nipic.com/20121205/10197997_003647426000_2.jpg"/>
    </body>
    ```
    
    *   相对路径表示相对于当前页面的路径，可以不是一个完整的URL地址
*   当前目录可以用“.”表示，也可以省略不写
*   “..”表示返回当前目录的上级目录

```html
<img src="imgs/sky.jpg" alt="天空" title="blue Sky" width="200px"
height="200px"/>
```

（此处需结合幻灯片中的图片讲解：展示IDEA中项目目录结构，imgs文件夹在当前html文件的同级或下级目录）

### 超链接

`<a href-“链接地址” target=”目标窗口位置”>超链接内容</a>`

*   href：表示链接地址的路径，同`<img>`标签的src属性类似，该路径可分为绝对路径和相对路径。
*   target：表示链接页面在浏览器哪个窗口打开，常用的取值有`_self`表示在当前窗口打开链接页面、`_blank`表示在新建窗口打开链接页面
*   例2-8.html

```html
<body>
    <a href="http://www.baidu.com" target="_blank">
        <img src="imgs/sky.jpg" width="100px" height="100px"/>
    </a>
    <a href="http://www.baidu.com" target="_blank">
        百度首页
    </a>
</body>
```

### 超链接（续）

*   **锚链接**
    *   定位到页面内的某一个具体位置
    1.  在页面的目标位置设置标记，该标记也称为锚点，语法为：
        `<a name=”marker”>目标位置</a>`
        name属性用于规定锚的名称，此处锚点名称为”marker”.
    2.  在页面的源位置设置超链接，语法为：
        `<a href=”#marker”>源位置</a>`

```html
<body>
    <a href="#marker">源位置</a><br>
    <!--省略部分 html 代码-->
    <a name="marker">目标位置</a>
</body>
```

### 列表

*   **有序列表**
    *   `<ol>`标记，每一个列表项前使用`<li>`标记，每一个项目都有前后顺序之分
*   **无序列表**
    *   无序列表使用`<ul>`标记，每一个列表项前使用`<li>`标记，编号类型默认使用粗体圆点
*   **定义列表**
    *   定义列表默认没有任何编号，一般用于有多个标题并且每个标题下有一个或多个列表项的情况，`<dl>`标签作为列表的开始，使用`<dt>`标签作为每个列表项的起始标记，使用`<dd>`标签来定义每个列表项
*   例2-9~11.html

```html
<!-- 有序列表代码示例 -->
<body>
    <ol>
        <li>列表项 1</li>
        <li>列表项 2</li>
        <li>列表项 3</li>
    </ol>
</body>

<!-- 无序列表代码示例 -->
<body>
    <ul>
        <li>无序列表 1</li>
        <li>无序列表 2</li>
        <li>无序列表 3</li>
    </ul>
</body>

<!-- 定义列表代码示例 -->
<body>
    <dl>
        <dt>编程语言</dt>
            <dd>Java</dd>
            <dd>C++</dd>
            <dd>Python</dd>
        <dt>操作系统</dt>
            <dd>Windows</dd>
            <dd>Linux</dd>
            <dd>Mac</dd>
    </dl>
</body>
```

（此处需结合幻灯片中的图片讲解：分别展示有序列表（带数字1. 2. 3.）、无序列表（带圆点）、定义列表（缩进结构）在浏览器中的显示效果）

### 表格

*   `<table>`标签定义，表格中的行由`<tr>`标签定义，每一行的单元格由`<td>`标签来定义。表格的标题定义在`<th>`标签内，其中文字会自动变成粗体。
*   border属性
*   **跨行和跨列**
    *   合并单元格需要对`<td>`标签中的rowspan或colspan属性进行设置
    *   从当前单元格起，跨行或者跨列所占用单元格的数量
    *   跨行合并后，被合并行的相应单元格无需定义
    *   2-13.htm

```html
<body>
    <table border="1">
        <tr>
            <th>大学</th>
            <th>学院</th>
            <th>专业</th>
        </tr>
        <tr>
            <td>浙江大学</td>
            <td>计算机学院</td>
            <td>计算机科学与技术</td>
        </tr>
        <tr>
            <td>温州大学</td>
            <td>计算机与人工智能学院</td>
            <td>大数据科学与技术</td>
        </tr>
    </table>
</body>
```

（此处需结合幻灯片中的图片讲解：展示上述代码生成的简单表格，包含表头和两行数据）

```html
<!-- 跨行跨列示例 -->
<table border="1">
    <tr>
        <td colspan="2">跨列合并</td>
        <td>1行3列</td>
    </tr>
    <tr>
        <td>2行1列</td>
        <td>2行2列</td>
        <td>2行3列</td>
    </tr>
</table>

<body>
    <table border="1">
        <tr>
            <td rowspan="2">跨行合并</td>
            <td>1行2列</td>
            <td>1行3列</td>
        </tr>
        <tr>
            <td>2行2列</td>
            <td>2行3列</td>
        </tr>
    </table>
</body>
```

（此处需结合幻灯片中的图片讲解：展示跨列合并（左图）和跨行合并（右图）的表格效果）

### 表单

*   网页中可以让用户在一些控件如文本框、密码框中输入内容，然后提交。这些控件所在的区域称之为表单（Form）
*   使用`<form>`标签来创建表单，该标签只在网页中创建表单区域，表单元素需要放在它的范围内才有效
*   action和method属性（服务端编程中详细讲解）
*   `<input>`标签是编写表单的最常用表单元素

| 属性 | 说明 |
| :--- | :--- |
| type | 指定表单元素的类型 |
| name | 指定表单元素的名称 |
| value | 指定表单元素的初始值 |

*   其中type属性决定了表单元素的类型可以为以下的值。
*   text：文本框，text也是type的默认属性
*   password: 密码框
*   radio: 单选框
*   checkbox：复选框, checked属性可设置默认被选。
*   submit：提交按钮，按此按钮浏览器会将表单的内容提交给action属性指定的URL地址
*   reset：重置按钮，按此按钮会将所有表单元素变为默认值。
*   button：普通按钮。
*   多行文本框和下拉菜单，分别使用`<textarea>`和`<select>`标签
*   2-15~16.html

```html
<body>
    <h3>个人注册</h3>
    <form>
        登录名（文本框）：<input type="text" name="username" value="wzu"> <br>
        密码（密码框）：<input type="password" name="pwd" value=""> <br>
        选择性别（单选框）：
        <input type="radio" name="sex" value="boy" checked>男
        <input type="radio" name="sex" value="girl">女 <br>
        选择爱好（复选框）：
        <input type="checkbox" name="interest" value="calligraphy">书法
        <input type="checkbox" name="interest" value="signing" checked>唱歌
        <input type="checkbox" name="interest" value="basketball">篮球
        <input type="checkbox" name="interest" value="game">游戏 <br>
        上传个人头像（文件域）： <br>
        <input type="file" name="photo"><br>
        <input type="submit" value="注册">
        <input type="reset" value="重置">
        <input type="button" value="普通按钮">
    </form>
</body>
```

（此处需结合幻灯片中的图片讲解：展示上述个人注册表单代码在浏览器中的运行效果，包括各种输入框和按钮）

```html
<body>
    <form>
        <h3>填写个人信息（多行文本域）：</h3>
        <textarea name="personal" cols="40" rows="6"></textarea>
        <h3>选择出生月份（下拉菜单）：</h3>
        <select name="month">
            <option value="">选择月份</option>
            <option value="1" selected>1 月</option>
            <option value="2">2 月</option>
            <option value="3">3 月</option>
        </select>
    </form>
</body>
```

（此处需结合幻灯片中的图片讲解：展示多行文本域和下拉菜单在浏览器中的运行效果）

### 总结

*   HTML原、结构
*   HTML常见标签
*   在线文档：
    http://www.w3school.com.cn/

（此处需结合幻灯片中的图片讲解：右侧有一个写着“查！”的大方框，提示学生善用在线文档查询）

## CSS基础知识

### CSS简介

*   **层叠**样式表 (Cascading Style Sheets)
*   给网页添加样式

（此处需结合幻灯片中的图片讲解：左图为破旧的木屋，右图为被植物和鲜花装饰的漂亮房屋，对比展示CSS装饰网页的作用）

### CSS基本原理

1.  网页->节点构成的树形结构
2.  选择节点->装饰

（此处需结合幻灯片中的图片讲解：左侧为HTML DOM树形结构图，右侧为CSS规则结构图，展示了Selector（选择器）、Property（属性）、Value（值）以及Declaration（声明）的对应关系）

### 样式表

*   样式规则必须放在一对大括号“{}”内，可以是一条或多条，属性和值之间用英文冒号 “:”分开，每条规则以英文分号“;”结尾

```css
p {
    color: blue;
    font-size: 20px;
    width: 200px;
}

h1 {
    color: green;
    font-size: 36px;
    text-align: center;
}
```

### 在HTML中使用CSS

#### 行内样式

*   行内样式是通过在 HTML 标签中添加style属性来引入CSS

```html
<body>
    <p style="color:blue; fontsize:20px">蓝色字体，大小 20 像素</p>
    <p style="color:green; font-size:15px">绿色字体，大小 15 像素</p>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器中第一行文字为蓝色大号字体，第二行文字为绿色小号字体）

#### 内部样式

*   内部样式表就是将CSS代码写在HTML的`<head>`标签中，与HTML内容位于同一个页面中。

```html
<head>
    <meta charset="UTF-8">
    <title>内部样式</title>
    <style>
        h1{
            color: red;
        }
    </style>
</head>
<body>
    <h1>我是红色标题</h1>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器中标题文字显示为红色）

#### 外部样式

*   外部样式表就是将 CSS 代码保存为一个单独的文件，文件扩展名为.css

（此处需结合幻灯片中的图片讲解：展示项目目录结构，css文件夹下有一个`out.css`文件；以及HTML代码中通过`<link>`标签引入css文件）

```html
<head>
    <meta charset="UTF-8">
    <title>外部样式表</title>
    <link href="css/out.css" rel="stylesheet" type="text/css">
</head>
```

#### 三种方式的优先级

*   CSS 名为层叠样式表的原因是允许同时给网页中的元素应用多个样式，页面元素的**最终**样式即为多个样式的叠加效果。
*   例：3-4.html

```html
<head>
    <meta charset="UTF-8">
    <title>三种方式优先级</title>
    <link href="css/out.css" rel="stylesheet" type="text/css">
    <style>
        h1{
            color: red;
        }
    </style>
</head>
<body>
    <h1 style="color:green">我是什么颜色？</h1>
</body>
```

并在 out.css 文件中添加如下代码：

```css
h1 {
    color: blue;
}
```

*   该页面的标签最终显示的字体为绿色，因为行内样式离该标签最近,又或者将上述代码的行内样式去掉，并将内部样式和外部样式交换位置。

## CSS常见选择器

### 基本选择器

*   CSS 的基本选择器主要分为标签选择器、ID 选择器和类选择器三种

#### 标签选择器

*   根据标签的名字来从页面中选取指定的元素，每种 HTML 标签的名称都可以作为相应的标签选择器名称。

```css
p {
    color: blue;
}
```

#### 类选择器

*   根据标签中class属性所指定的值选取指定的元素,类选择器的作用便是声明同一组元素标签的样式

```html
<p class="title">我是属于 title 组</p>
<p class="title">我是属于 title 组</p>
<p class="title">我是属于 title 组</p>
```

```css
.title {
    font-size: 16px;
    color: #00509F;
}
```

（此处需结合幻灯片中的图片讲解：展示三个P标签的文字都应用了相同的样式）

#### ID选择器

*   根据标签中ID属性所指定的值选取指定的元素, ID 选择器主要用来对某个特定元素定义样式。

例：3-6.html

```html
<head>
    <meta charset="UTF-8">
    <title>ID 选择器</title>
    <style>
        #wzu{
            color:red;
        }
    </style>
</head>
<body>
    <p id = "wzu">ID 属性为 WZU 的段落</p>
    <p id = "zju">ID 属性为 ZJU 的段落</p>
</body>
```

（此处需结合幻灯片中的图片讲解：展示ID为WZU的段落变成了红色，而ID为ZJU的段落保持默认）

### 高级选择器

*   CSS 常用的高级选择器，有层次选择器、并集选择器和交集选择器等
*   文档对象模型（Document Object Model, DOM)

（此处需结合幻灯片中的图片讲解：左侧为HTML代码，右侧为对应的DOM树状结构图，展示了body、ul、li、a等元素的层级关系）

#### 层次选择器

*   层次选择器通过 DOM 模型可以快速选择需要的元素

**表 3-1 层次选择器**

| 选择器 | 类型 | 功能描述 |
| :--- | :--- | :--- |
| A B | 后代选择器 | 选择元素 A 的所有与元素 B 匹配的后代元素 |
| A>B | 子选择器 | 选择元素 A 的所有与元素 B 匹配的子元素 |
| A+B | 相邻兄弟选择器 | 选择元素 A 后紧跟的与元素 B 匹配的元素 |
| A~B | 一般兄弟选择器 | 选择元素 A 后所有与元素 B 匹配的元素 |

*   **后代选择器（选择某元素的所有匹配后代元素）：**

```css
body a {
    background: red;
}
```

（此处需结合幻灯片中的图片讲解：展示HTML结构中，无论是直接子元素`a`还是深层嵌套在`li`中的`a`，背景都变成了红色。对应图片中的数字1, 2, 3及右侧列表中的数字背景均为红色）

*   **子选择器（选择某元素的所有匹配子元素）：**

```css
body>a {
    background: red;
}
```

（此处需结合幻灯片中的图片讲解：展示仅有`body`下的直接子元素`a`（即数字1, 2, 3）背景变红，而嵌套在`ul`列表中的`a`不受影响）

*   **相邻兄弟选择器（选择紧跟在另一个元素后面的元素）：**

```css
#my+li {
    color: red;
}
```

（此处需结合幻灯片中的图片讲解：HTML中id为"my"的li元素后的**这一个**li元素（即内容为6的行）背景被标记为红色）

*   **一般兄弟选择器（选择某元素后面的所有兄弟元素）：**

```css
#my~li {
    color: red;
}
```

（此处需结合幻灯片中的图片讲解：HTML中id为"my"的li元素后的**所有**同级li元素（即内容为6和7的行）背景被标记为红色）

#### 并集选择器

*   并集选择器是指多个选择器的合并，各个选择器用“,”隔开。主要用来给多个选择器同时设置样式

```css
#my, h1, p {
    background: yellow;
}
```

（此处需结合幻灯片中的图片讲解：展示id为my的元素、h1标题、p段落都应用了黄色背景）

#### 交集选择器

*   交集选择器也是指多个选择器的组合，但交集选择器需要同时满足其中每一个选择器的条件，并且各个选择器之间没有分隔符

```css
a.you {
    background: yellow;
}
```

（此处需结合幻灯片中的图片讲解：展示同时是`a`标签且class为`you`的元素（即数字1）应用了黄色背景）

## CSS样式设置

### 文本样式

*   CSS 对网页文字的设置主要包括设置字体大小、类型、颜色、风格以及文本段落的对齐方式、行高、文字缩进等。

```html
<head>
    <meta charset="UTF-8">
    <title>span 标签</title>
    <style type="text/css">
        p{ font-size: 14px;}
        p .poem{font-size: 30px;}
        p #Li{font-size: 24px;font-weight: bold}
        p span{font-size: 20px; font-style: italic}
    </style>
</head>
<body>
    <p>锄禾日当午，汗滴禾<span class="poem">下锄</span>。 </p>
    <p>霍元甲，<span id="Li">陈真</span>和叶问。</p>
    <p>拳王<span>阿里</span>、泰森、霍利菲尔德</p>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器中不同样式的文本渲染效果，如“下锄”字号大，“陈真”加粗等）

#### 常用字体设置

**表 3-2 常用字体属性设置**

| 属性名 | 含义 | 例子 |
| :--- | :--- | :--- |
| font-family | 设置子类型 | font-family:”宋体” |
| font-size | 设置字体大小 | font-size:15px |
| font-style | 设置字体风格 | font-style:italic |
| font-weight | 设置字体粗细 | font-weight:bold |
| font | 在一个声明中设置所有字体属性 | font:italic bold 30px “宋体” |

#### 常用文本样式设置

**表 3-3 常用文本样式设置**

| 属性名 | 含义 | 例子 |
| :--- | :--- | :--- |
| color | 设置文本颜色 | color:red |
| text-align | 设置水平对齐方式 | text-align:left |
| text-indent | 设置首行文本的缩进 | text-indent:18px |
| line-height | 设置文本的行高 | line-height:20px |
| text-decoration | 设置文本的装饰 | text-decoration:underline |

更多的字体属性设置可参考 W3C 文档（https://www.w3school.com.cn/css/css_font.asp/）。

### 伪类样式

*   所谓伪类样式就是根据元素处于某种行为或者状态时的特征来修饰样式。基本语法为“标签名：伪类名{声明;}”,常用的超链接伪类有四种

**表 3-4 超链接伪类**

| 伪类名称 | 含义 | 伪类样式举例 |
| :--- | :--- | :--- |
| A:link | 未单击访问的状态 | A:link {color:yello} |
| A:visited | 单击访问后的状态 | A:visited {color:blue} |
| A:hover | 鼠标悬浮其上的状态 | A:hover {color:red} |
| A:active | 鼠标单击未释放的状态 | A:active {color:green} |

需要注意的是，对超链接伪类设置样式时要按照如下顺序进行：
a:link->a:visited->a:hover->a:active，如果先设置“a:hover”再设置“a:visited”，则“a:visited” 将不起作用。

```html
<head>
    <meta charset="UTF-8">
    <title>超链接样式</title>
    <style type="text/css">
        a{text-decoration: none}
        a:link{color: #00509F}
        a:visited{color: yellowgreen}
        a:hover{
            text-decoration: underline;
            color: antiquewhite;
        }
        a:active{color:darkred;}
    </style>
</head>
<body>
    <a href="http://www.baidu.com" target="_blank">钢铁侠</a>
</body>
```

（此处需结合幻灯片中的图片讲解：展示超链接“钢铁侠”在默认、鼠标划过、鼠标按住不放、访问后四种不同状态下的颜色和下划线变化。注：IE有效）

### 背景样式

*   DIV标签: 一对标签独占一行（块元素）
*   背景样式主要包括背景颜色（background-color）、 背景图片（background-image）、背景图片大小（background-size）、背景图片重复方式 （background-repeat）和背景图片位置。
*   将背景图片的颜色，路径，位置和重复属性放到一起声明

```css
.title{
    background: #C00 url("down_arrow.jpg") 170px 0px no-repeat;
    background-size:15%;
}
```

**示例代码：**

```html
<body>
    <div id="nav">
        <h1 class="title">电影分类</h1>
        <ul>
            <li><a href="#">枪战片</a><a href="#">犯罪片</a></li>
            <li><a href="#">伦理片</a><a href="#">记录片</a></li>
            <li><a href="#">爱情片</a><a href="#">武侠片</a></li>
        </ul>
    </div>
</body>

<style type="text/css">
    #nav{
        width:200px;
        background-color: beige;
    }
    .title{
        background-color:#C00;
        background-image: url("down_arrow.jpg");
        background-size:15%;
        background-repeat:no-repeat;
        background-position: 170px 0px;
    }
</style>
```

（此处需结合幻灯片中的图片讲解：展示电影分类菜单的渲染效果，标题背景为红色且右侧带有向下箭头图标，列表区域背景为米色）

### CSS盒子模型

*   网页中任何一个元素都可以抽象成一个矩形，该矩形有一个“边框”（border），边框和相片的距离成为“内边距” （padding），每个相框之间的距离成为“外边距”（margin）。这种 padding-border-margin 的模型是一种极其通用的描述矩形对象布局形式的方法，我们称之为“盒子”模型。

（此处需结合幻灯片中的图片讲解：右图为盒子模型示意图，从内到外依次为 element(元素)、padding(内边距)、border(边框)、margin(外边距)）

**示例代码：**

```html
<style type="text/css">
    .box{border:1px solid #3a6}
    form{background-color: antiquewhite}
    h2{background-color: aquamarine}
    #pwd{background-color: yellow}
</style>
<!-- 省略 HTML body 结构，见下方图片代码 -->
```

（此处需结合幻灯片中的图片讲解：展示一个用户登录界面，其中应用了边框、背景色等盒子模型属性）

### 标准文档流

*   网页默认的布局方式为标准文档流方式，所谓标准文档流是指网页根据块级元素或行内元素的特性按从上到下、从左到右的方式自然排列。标准文档流有如下几条重要的特性：
*   块级元素无论内容多少，都会独占一行
*   块级元素可以设置高度和宽度
*   行内元素不会独占一行
*   行内元素的高度和宽度由内容撑开

```html
<style type="text/css">
    div{
        border: 1px solid blue;
        width: 100px;
        height: 100px;
    }
    span{
        border: 1px solid red;
        width: 100px; /*高度宽度设定无效*/
        height: 100px;
    }
</style>
```

（此处需结合幻灯片中的图片讲解：展示DIV块级元素独占一行且宽高生效，span行内元素并排显示且宽高设置无效）

### 浮动

*   浮动是指将块级元素排列在一行并且支持宽度和高度设定的方法
*   CSS 中设置 float 属性，默认值为 none。如果将 float 属性值设置为 left 或 right，元素就会向其父元素的左侧或者右侧浮动

```css
div{
    border: 1px solid blue;
    width: 100px;
    height: 100px;
    float: left;
}
```

（此处需结合幻灯片中的图片讲解：展示div1和div2两个盒子并排显示，因为设置了左浮动）

*   如果只有 div1 设置了浮动，则只有 div1 会脱离标准文档流并且原先所在的位置会被 div2 所占据。需要注意的是，div2 的文字内容会环绕浮动块显示而不会被覆盖

（此处需结合幻灯片中的图片讲解：展示div1左浮动，div2占据了div1原本的位置，文字环绕在div1周围）

### 清除浮动

*   元素的浮动会影响其他元素的位置。若要使得标准文档流中的元素不受其他浮动元素的影响，则需要用到 clear 属性来清除浮动

```css
#d2{
    /*float: left;*/
    clear:left;
}
```

（此处需结合幻灯片中的图片讲解：展示div2使用了清除浮动后，回到了div1的下方显示）

### 定位

*   CSS 中使用 position 属性来对元素进行定位。Position 属性有四个值，分别代表着不同的定位类型。
*   **Static：** 默认值，没有定位。元素按照标准文档流进行布局。
*   **Relative：** 相对定位，盒子的位置以标准文档流为基准，然后**相对于原本所在的位置偏移指定的距离**。相对定位后的盒子仍在标准文档流中，其后的盒子仍以标准文档流方式对待。
*   **Absolute：** 绝对定位，**以它最近的一个已经定位的祖先元素为基准进行定位**。如果没有祖先元素被定位，则以`<body>`标签为基准（浏览器左上角）。绝对定位的盒子会从标准文档流中脱离，并且对其后的其他盒子的定位没有影响。
*   **Fixed：** 与 absolute 类似，但不同的是以浏览器窗口为基准进行定位。

**定位示例代码：**

```html
<style type="text/css">
    div{ padding: 5px; font-size: 10px; }
    #outer{ margin: 10px; border: 1px #555 solid; }
    #in1{ background-color: yellowgreen; }
    #in2{ background-color: lightseagreen; }
    #in3{ background-colr: papayawhip; }
</style>
<body>
    <div id="outer">
        <div id="in1">div1</div>
        <div id="in2">div2</div>
        <div id="in3">div3</div>
    </div>
</body>
```

（此处需结合幻灯片中的图片讲解：展示三个div在默认static定位下的标准流堆叠显示）

*   使用相对定位将 div1 定位的位置为相对于原始位置向右上方移动 20px

```css
#in1{
    background-color: yellowgreen;
    position: relative;
    top: -20px;
    left: 20px;
}
```

从图中可以看出 div1 相对于起始位置偏移了一定的距离，并且其他元素不受影响，说明相对定位并没有脱离标准文档流。

（此处需结合幻灯片中的图片讲解：展示div1向右上方偏移，覆盖了部分边框，但div2和div3的位置保持不变）

*   **绝对定位的例子**

**情况1：以最近的已定位祖先元素为基准**

```css
#outer{
    ...
    position: relative;
}
/*...*/
#in2{
    background-color: lightseagreen;
    position: absolute;
    top: 0px;
    left: 0px;
}
```

（此处需结合幻灯片中的图片讲解：展示div2定位到了outer容器的左上角，覆盖了div1）

**情况2：无已定位祖先元素**

（此处需结合幻灯片中的图片讲解：如果outer没有定位，div2将相对于浏览器窗口/body左上角定位）

### 总结

*   CSS概念
*   CSS选择器
*   盒子模型
*   浮动
*   定位

## JAVASCRIPT 基础

### WAHT

JavaScript 是一种基于对象和事件驱动的网页脚本语言。虽然它名字中含有 Java，但它 与 Java 是两种不同的语言，只是语法非常类似。一个完整的 JavaScript 主要由以下三个部分组成：

*   **ECMAScript**： 是一种标准的脚本语言规范，它规定了 JavaScript 的基础语法部分，包括 变量和数据类型、运算符、逻辑控制语句、关键字和保留字以及对象等
*   **BOM**：（Browser Object Model，浏览器对象模型）提供了可独立于内容与浏览器进行交 互的对象，主要用于管理浏览器窗口与窗口之间的通讯
*   **DOM**： （Document Object Model，文档对象模型）是 HTML 文档对象模型定义的一套标 准方法，用来访问和操纵 HTML 文档。

### 基础用法

JavaScript代码可以嵌入到HTML的`<script>`标签中

```html
<body>
    <script type="text/javascript">
        alert("Hello world...")
    </script>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器弹出的 "Hello world..." 提示框）

### HTML中嵌入JS三种方式

*   **内嵌脚本（不常见）**
    *   要执行的语句写在标签中
    ```html
    <input type="button" onclick="javascript:clearInterval(p)" value="stop">
    ```
*   **内部脚本**
    *   内部脚本块定义在同一页面的`<script>`中
*   **外部脚本**
    *   单独的js文件中，通过src属性指定
    ```html
    <script type="text/javascript" src="js/script.js"></script>
    ```
*   **嵌入脚本的位置** （一般要么在body前，要么在body后，**两者有重大区别**）

## JAVASCRIPT基础语法

### 变量

1.  定义变量始终使用var
    ```javascript
    var message = "hi";
    ```
2.  JS 是种动态类型语言 (4-2.html)

```javascript
var x = 5;
var y = 12.5;
var s = 'hello world';
var b = false;
var arr = new Array("stu", "tea", "中国");
var und;
var nul = null;
```

> typeof()方法可以查看变量类型

### 对象

**语法：**

$$ \text{var obj} = \{ \text{变量名1}: \text{“变量值1”}, \text{变量名2}: \text{“变量值2”}, \dots, \text{变量名n}: \text{“变量值n”} \} $$

**例如，可以定义一个汽车对象：**

```javascript
var car = {type:"porsche", model:"911", color:"white"};
```

```javascript
var person = {
    firstName: "Bill",
    lastName : "Gates",
    id       : 678,
    fullName : function() {
        return this.firstName + " " + this.lastName;
    }
};
```

```javascript
var facebook = {
    name: "Facebook",
    ceo: {
        firstName: "Mark",
        favColor: "blue"
    },
    "stock of company": 110
};
```

### 访问对象

**语法：**

```javascript
objectName.propertyName //访问对象属性
objectName.methodName() //访问对象方法
```

**“.”操作符可以连续：**

(4-2-2.html)

### 输出

**警告框输出**

```html
<script type="text/javascript">
    var name = "Jack";
    alert("my name is " + name)
    var age = 32;
    alert("my age is " + String(age))
</script>
```

**控制台输出**

```html
<script type="text/javascript">
    var name = "Jack";
    console.log("My name is " + name )
</script>
```

（此处需结合幻灯片中的图片讲解：展示浏览器开发者工具Console面板中输出 "My name is Jack"）

### 输入

**提示框输入**

```html
<script type="text/javascript">
    var cls = prompt("请输入你所在的班级：")
    alert("输入的班级为：" + cls)
</script>
```

（此处需结合幻灯片中的图片讲解：展示浏览器弹出的输入框以及输入后的确认弹窗）

### 函数和事件

1.  **声明函数统一用function，无需返回值，形参无需var**

（此处需结合幻灯片中的图片讲解：指出 Arguments defined without 'var'）

```javascript
function compare (x, y) {
    return x > y;
}
```

```javascript
var a = function () {...}
```

（此处需结合幻灯片中的图片讲解：指出 Value of function assigned, NOT the returned result! 以及 No name defined）

**事件是使用JavaScript实现网页特效的灵魂，当用户与浏览器交互时会触发各类事件**

**表 4-1 JavaScript 常见事件**

| 名称 | 说明 |
| :--- | :--- |
| onload | 页面加载完成后执行 |
| onclick | 鼠标单击执行 |
| onmouseover | 鼠标滑过执行 |
| onkeydown | 某个按键按下执行 |
| onchange | 域内容改变后执行 |

**4-4.html**

```html
<body>
    <script type="text/javascript">
        function hello(name, age) {
            alert("你好： " + name + age)
        }
    </script>
    <input type="button" value="打招呼" onclick="hello('jack', 99)">
</body>
```

### 条件和循环

*   语法同Java一致，例如以下函数使用了 for 循环来在控制台打印数字 0~n-1（n 为参数）

```javascript
function printNum(n) {
    for(var i = 0; i<n; i++) {
        console.log(i)
    }
}
```

## BOM操作

### WINDOW对象

*   BOM提供了独立于内容的、可以与浏览器窗口交互的一系列对象，其中window对象时整个BOM的核心。
*   由于window对象是全局对象，因此在访问window对象的方法或属性时，可以省略window对象。

| 名称 | 说明 |
| :--- | :--- |
| alert() | 警告对话框 |
| prompt() | 提示框 |
| confirm() | 确认框 |
| setTimeout() | 在指定的毫秒数后调用函数 |
| setInterval() | 按照指定的周期循环调用函数 |

### 定时器

window对象中的常用定时器函数

*   **setTimeout()**
    *   该函数用于在指定的毫秒数后调用函数或表达式
    ```javascript
    function timeAlert() {
        setTimeout("alert('闹钟 3s')", 3000)
    }
    ```
*   **setInterval()**
    *   setInterval()函数会在一定周期内不停的调用某一函数，直到窗口被关闭或者强制停止
    ```javascript
    function timeInterval() {
        setInterval("alert('闹钟每隔 3s')", 3000)
    }
    ```
*   **clearTimeout()和clearInterval()**
    *   清除闹铃

（此处需结合幻灯片中的图片讲解：展示定时器运行效果代码示例及浏览器弹窗）

```html
<body>
    <button onclick="timeInterval()">setInterval 定时器</button>
    <button onclick="javascript:clearInterval(t)">清除 timeInterval 定时器
    </button>
    <script>
        var t;
        function timeInterval() {
            t = setInterval("alert('闹钟每隔 3s')", 3000)
        }
    </script>
</body>
```

### WINDOW对象的常见子对象

| 名称 | 说明 |
| :--- | :--- |
| history | 历史URL信息 |
| location | 当前URL信息 |
| document | 当前文档对象 |

**History对象**

| 名称 | 说明 |
| :--- | :--- |
| Back() | 返回上一页 |
| Forward() | 返回下一页 |
| Go(n) | n为整数，整数表示前进n个页面，负数表示后退n个页面 |

```html
<body>
    <input type="button" value="后退" onclick="history.back()">
    <input type="button" value="前进" onclick="history.forward()">
    <script type="text/javascript">
        url = prompt("请输入要跳转的 URL 地址： ");
        location.href = url
    </script>
</body>
```

### DOCUMENT对象（简介）

*   document 对象即是 window 对象的一部分，也代表了整个页面（文档），可用来访问页 面中的所有元素（页面元素是一个树形结构）。

**表 4-5 document 对象常用方法**

| 名称 | 描述 |
| :--- | :--- |
| Write() | 向页面写文本 |
| getElementById() | 根据元素 ID 返回该元素的引用 |
| getElementsByName() | 根据元素 name 属性名称返回对象的集合 |
| getElementsByTagName() | 根据元素的标签名返回对象的集合 |

**代码示例：**

```html
<body>
    <script type="text/javascript">
        document.write("简单动态效果");
        function changeCity() {
            document.getElementById("zcity").innerHTML = "上海";
        }
        function getZCity() {
            var zcities = document.getElementsByName("zcity");
            var str = '';
            for (var i = 0; i < zcities.length; i++) {
                if (zcities[i].checked == true)
                    str += zcities[i].value + " ";
            }
            document.getElementById("text").innerHTML = str;
        }
    </script>
    <div id="zcity">杭州</div>
    <input type="button" value="改变城市" onclick="changeCity()">
    <input type="checkbox" name="zcity" value="温州">温州
    <input type="checkbox" name="zcity" value="宁波">宁波
    <input type="checkbox" name="zcity" value="台州">台州 <br>
    <input type="button" value="获取浙江省城市" onclick="getZCity()">
    <p id="text"></p>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器中城市选择和文字改变的动态效果）

## DOM概述

当网页被加载时，浏览器会为针对当前网页创建 **DOM(Document Object Model)**。
该模型为**对象的树结构**。

（此处需结合幻灯片中的图片讲解：展示 HTML 文档结构与 DOM 树形结构的对应关系图，包括 document, html, head, body, title, a, 文本节点等）

### DOM作用

> 通过可编程的对象模型，JavaScript 获得了足够的能力来创建动态的 HTML。

*   JavaScript 能够改变页面中的所有 HTML 元素
*   JavaScript 能够改变页面中的所有 HTML 属性
*   JavaScript 能够改变页面中的所有 CSS 样式
*   JavaScript 能够对页面中的所有事件做出反应

http://www.w3school.com.cn/htmldom/index.asp

### 节点

**节点： Node——构成HTML文档最基本的单元。**

常用节点分为四类
*   **文档节点**：整个HTML文档
*   **元素节点**：HTML文档中的HTML标签
*   **属性节点**：元素的属性
*   **文本节点**：HTML标签中的文本内容

（此处需结合幻灯片中的图片讲解：展示 `<p id="pId">This is a paragraph</p>` 代码中对应的元素节点、属性节点和文本节点的关系）

### DOCUMENT对象

*   **原生JavaScript使用document对象操作DOM**

| 名称 | 描述 |
| :--- | :--- |
| write() | 向页面写文本 |
| getElementById() | 根据元素ID返回该元素的引用 |
| getElementsByName() | 根据元素name属性名称返回对象的集合 |
| getElementsByTagName() | 根据元素的标签名返回对象的集合 |

*   **由于操作繁琐，实际开发中一般使用框架（JQuery）**

### 操作节点（查、增、删、改）

| 方法 | 描述 |
| :--- | :--- |
| getElementById() | 返回带有指定 ID 的元素。 |
| getElementsByTagName() | 返回包含带有指定标签名称的所有元素的节点列表（集合/节点数组）。 |
| getElementsByClassName() | 返回包含带有指定类名的所有元素的节点列表。 |
| appendChild() | 把新的子节点添加到指定节点。 |
| removeChild() | 删除子节点。 |
| replaceChild() | 替换子节点。 |
| insertBefore() | 在指定的子节点前面插入新的子节点。 |
| createAttribute() | 创建属性节点。 |
| createElement() | 创建元素节点。 |
| createTextNode() | 创建文本节点。 |
| getAttribute() | 返回指定的属性值。 |
| setAttribute() | 把指定属性设置或修改为指定的值。 |

> 实际开发中，更普遍的是使用JQuery来操作DOM而很少使用原生的JavaScript来操作DOM

### 总结

1.  **JS的难点在于面向对象（这门课程涉及的不多）**
2.  **掌握其基本的用法即可（语法、BOM、DOM）**
3.  **JQuery为前端当前最流行的JS框架（重点）**

### 小结

**一般正则表达式无需自己写**
**但要懂的看、查、用**

## 第5章 JQUERY基础

### WHAT?

*   **JavaScript本身存在两个缺点：** 一是复杂的DOM操作，另一个是不一致的浏览器实现
*   **jQuery 是一种轻量级的 JavaScript 库，** 它的设计主旨是“write less, do more”,库中封装了很多预定义的对象和使用函数,能够帮助开发人员轻松搭建具有高难度交互功能的客户端页面，并且可以**完美兼容**各大浏览器
*   **JavaScriptjQuery在经历了若干次版本更新后，** 逐渐从各种JavaScript库中脱颖而出，称为Web开发人员的最佳选择

### CONTENT

*   **使用 jQuery 的作用主要包括五个方面**
    *   访问和操作 DOM
    *   控制页面样式
    *   对页面事件的处理
    *   方便地使用 jQuery 插件
    *   便捷地使用 AJAX

### 开发环境搭建

*   **下载jQuery** （ https://jquery.com/download/ ）
*   **开发版（未压缩）** 和发布版（压缩） `jquery-3.4.1.js`
*   **拷贝到工程中，并引入**

| 名称 | 说明 |
| :--- | :--- |
| jQuery.版本号.js | 完整无压缩版本，主要用于测试、学习和开发 |
| jQuery.版本号.min.js | 经过压缩后的版本，主要用于发布的产品和项目 |

```html
<head>
    <meta charset="UTF-8">
    <title>jQuery</title>
    <script src="js/jquery-3.4.1.js"></script>
</head>
```

（此处需结合幻灯片中的图片讲解：展示项目目录结构以及在HTML head标签中引入jquery.js文件的代码）

### 工厂函数$()

*   **工厂函数$()的作用是将DOM对象转化为jQuery类型的对象，** 从而使得该对象能调用相应的jQuery方法
*   将函数作为参数传入ready()方法，表示在页面加载完成后才执行该函数，类似于window对象的onload功能
*   **为了简化开发，** 通常省略ready()方法，而将事件处理函数直接传给工厂函数

```javascript
<script type="text/javascript">
    $(document).ready(function () {
        alert("Hello JQuery...");
    })
</script>
```

（此处需结合幻灯片中的图片讲解：展示代码运行后弹出的“Hello JQuery...”对话框）

```javascript
$(function () {
    alert("Hello JQuery...")
})
```

*   **在jQuery中，美元符号“$”实际代表的是jQuery对象本身，** 因此工厂函数$()也可写成jQuery()，$后面也可以直接调用方法

```javascript
jQuery(function () {
    var str = ' my university '
    console.log('---'+$.trim(str)+'---')
})
```

*   **除了DOM对象和函数外，** 还可以给工厂函数**传递选择器**、元素字符串本身等，后续详解

### JQUERY对象和DOM对象

*   **DOM对象** 5-2.html
    *   使用原生JavaScript方法如getElementById() 等方法获取到的DOM元素就是DOM对象， DOM对象有其独有的属性和方法

```javascript
var domObj = document.getElementById("myId") // 获取DOM对象
alert(domObj.innerHTML) // 使用DOM对象的innerHTML属性
```

*   **jQuery对象**
    *   jQuery对象是指通过工厂函数将DOM对象转换后的对象，它能够使用jQuery方法

```javascript
$(function () {
    alert($("#myId").html())
})
```

    *   \#myId表示jQuery选择器（用单引号或双引号引用来表示）

*   **需要注意的是，jQuery对象无法使用DOM对象的任何属性和方法，同样，DOM对象也无法使用jQuery对象的任何属性和方法**

*   **相互转换**
    *   使用get()方法将jQuery对象转换成DOM对象
    *   将DOM对象转换成jQuery直接使用工厂函数即可

```javascript
var myDOM = $("#myId").get()
var $myjQuery = $(myDOM)
```

*   **实际开发中，通常给jQuery对象类型的变量名前加“$”符号以区分DOM对象类型的变量**

### 小结

*   **$的使用**
    *   当工厂函数使用（传函数、选择器、字符串。。）
    *   当对象使用

*   **jQuery对象和DOM元素的区别**

**本质： 选择节点，操作节点**

### 选择器

#### WHAT？

*   **选择器是 jQuery 的核心之一，** 其主要作用是为方便获取页面中的元素，然后为该元素 添加相应的行为，使页面交互变得快捷、丰富。根据 jQuery 选择器获取元素方式的不同， 可以分为通用 CSS 选择器和过滤选择器两种
*   **将 CSS 选择器加上单引号或者双引号作为 jQuery 的工厂函数的参数，** 称为 jQuery 的通用 CSS 选择器，语法 `$('CSS selector')`
*   **jQuery 支持大多数 CSS 选择 器，** 包括基本选择器、层次选择器和属性选择器，其语法与 CSS 选择器完全相同

#### 基本选择器

*   **基本选择器包括标签选择器、类选择器、ID 选择器、并集选择器、交集选择器和全集 选择器，** 通过基本选择器可以实现大多数页面元素的查找

**表 5-2 jQuery 基本选择器**

| 名称 | 返回值 | 示例 |
| :--- | :--- | :--- |
| 标签选择器 | 元素集合 | `$('h1')`选取所有`<h1>`元素 |
| 类选择器 | 元素集合 | `$(".title")`选择所有 class 属性为 title 的元素 |
| Id 选择器 | 单个元素 | `$("#my")`选择 id 为 my 的元素 |
| 并集选择器 | 元素集合 | `$('div,span,p')`选取所有 div、p 和 span 元素 |
| 交集选择器 | 单个或者多个 | `$('div#my')`选择 id 为 my 的 div 元素 |
| 全局选择器 | 元素集合 | `$('*')`选择所有页面元素 |

```html
<div id="div1" class="box">div1(class="box")</div>
<div id="div2" class="box">div2(class="box")</div>
<div id="div3">div3</div>
<span class="box">span(class="box")</span>

<br>
<ul>
  <li>AAAAA</li>
  <li title="hello">BBBBB(title="hello")</li>
  <li class="box">CCCCC(class="box")</li>
  <li title="hello">DDDDDD(title="hello")</li>
</ul>

<script>
    //1. 选择id为div1的元素
    $('#div1').css('background', 'red')
    //2. 选择所有的div元素
    $('div').css('background', 'red')
    //3. 选择所有class属性为box的元素
    $('.box').css('background', 'red')
    //4. 选择所有的div和span元素
    $('div,span').css('background', 'red')
    //5. 选择所有class属性为box的div元素
    $('div.box').css('background', 'red')
    $('*').css('background', 'red')
</script>
```

（此处需结合幻灯片中的图片讲解：展示代码运行后，不同元素背景色变为红色的效果）

#### 层次选择器

*   **层次选择器主要用来选择当前元素的后代元素、子元素、相邻元素和兄弟元素**

| 名称 | 返回值 | 示例 |
| :--- | :--- | :--- |
| 后代选择器 | 元素集合 | `$('#my span')`选择 id 为 my 元素下的所有后代元素`<span>` |
| 子选择器 | 元素集合 | `$('#my>span')`选择 id 为 my 元素下的所有子元素`<span>` |
| 相邻元素选择器 | 元素集合 | `$('#my+span')`选择紧邻 id 为 my 元素之后的兄弟元素`<span>` |
| 兄弟元素选择器 | 元素集合 | `$('#my~span')`选择 id 为 my 元素之后的所有兄弟元素`<span>` |

```html
<ul>
    <li>AAAAA</li>
    <li class="box">CCCCC</li>
    <li title="hello"><span>BBBBB</span></li>
    <li title="hello"><span class="box">DDDD</span></li>
    <span>EEEEE</span>
</ul>

<script>
    //1. 选中ul下所有的span
    $('ul span').css('background', 'yellow')

    //2. 选中ul下所有的子元素span
    $('ul>span').css('background', 'yellow')

    //3. 选中class为box的下一个li
    $('.box+li').css('background', 'yellow')

    //4. 选中ul下的class为box的元素后面的所有兄弟元素
    $('ul .box~li').css('background', 'yellow')
</script>
```

（此处需结合幻灯片中的图片讲解：展示代码运行后，选中元素背景色变为黄色的效果）

#### 属性选择器

*   **属性选择器通过 HTML 元素的属性来选择相应的**

**表 5-4 jQuery 属性选择器**

| 语法构成 | 返回值 | 示例 |
| :--- | :--- | :--- |
| `[attr]` | 元素集合 | `$("[href]")`选择含有 href 属性的元素 |
| `[attr=val]` | 元素集合 | `$("[href='#']")`选择 href 属性值为 “#” 的元素 |
| `[attr!=val]` | 元素集合 | `$("[href!='#']")` 选择 href 属性值不为 “#” 的元素 |
| `[attr^=val]` | 元素集合 | `$("[href^='http']")` 选择 href 属性值以 http 开头的元素 |
| `[attr$=val]` | 元素集合 | `$("[href$='com']")` 选择 href 属性值以 com 结尾的元素 |
| `[attr*=val]` | 元素集合 | `$("[href*='wzu']")` 选择 href 属性值包含 wzu 的元素 |
| `[attr1=val1][attr2=val2]...` | 元素集合 | `$("div[id][class='univ']")`选择含有 id 属性并且 class 属性为 univ 的 div 元素 |

#### 过滤选择器

*   **过滤选择器的主要作用是在原有匹配的元素中进行二次筛选**

**表 5-5 jQuery 过滤选择器**

| 语法构成 | 返回值 | 示例 |
| :--- | :--- | :--- |
| `:first` | 单个元素 | `$("li:first")`选取第一个 li 元素 |
| `:last` | 单个元素 | `$("li:last")`选取最后一个 li 元素 |
| `:not(selector)` | 集合元素 | `$("li:not(.my)")`选取 class 属性不是 my 的 li 元素 |
| `:even` | 集合元素 | `$("li:even")`选取索引为偶数所有 li 元素 |
| `:odd` | 集合元素 | `$("li:odd")`选取索引为奇数所有 li 元素 |
| `:eq(index)` | 单个元素 | `$("li:eq(3)")`选取索引为 3 的 li 元素 |
| `:gt(index)` | 集合元素 | `$("li:gt(3)")` 选取索引大于 3 的 li 元素 |
| `:lt(index)` | 集合元素 | `$("li:lt(3)")` 选取索引小于 3 的 li 元素 |
| `:hidden` | 集合元素 | `$(":hidden")`选取所有隐藏的元素 |
| `:visible` | 集合元素 | `$(":visible")`选取所有可见的元素 |

```javascript
<div id="div1" class="box">class为box的div1</div>
<div id="div2" class="box">class为box的div2</div>
<div id="div3">div3</div>
<span class="box">class为box的span</span>
<br/>
<ul>
  <li>AAAAA</li>
  <li title="hello">BBBBB</li>
  <li class="box">CCCCC</li>
  <li title="hello">DDDDDD</li>
  <li title="two">BBBBB</li>
  <li style="...">我本来是隐藏的</li>
</ul>

<script>
    //1. 选择第一个div
    $('div:first').css('background', 'red')

    //2. 选择最后一个class为box的元素
    $('.box:last').css('background', 'red')

    //3. 选择所有class属性不为box的div
    $('div:not(.box)').css('background', 'red') 

    //4. 选择第二个和第三个li元素
    $('li:gt(0):lt(2)').css('background', 'red') // 多个过滤
    $('li:lt(3):gt(0)').css('background', 'red')

    //5. 选择内容为BBBBB的li
    $('li:contains("BBBBB")').css('background', 'red')

    //6. 选择隐藏的li
    console.log($('li:hidden').length, $('li:hidden')[0])

    //7. 选择有title属性的li元素
    $('li[title]').css('background', 'red')

    //8. 选择所有属性title为hello的li元素
    $('li[title="hello"]').css('background', 'red')
</script>
```

（此处需结合幻灯片中的图片讲解：展示代码运行后，被筛选元素背景色变为红色的效果，以及控制台输出隐藏元素的日志）

### 事件模块

#### 事件绑定

**jQuery 绑定事件的方式主要有两种**

1） `$(‘selector’).eventName(function(){函数体})`

```javascript
$("#btn1").click(function () {
    alert("你好！")
})
```

2） `$(‘selector’).on(“eventName”, function(){函数体})`

```javascript
$("#btn1").on('click', function () {
    alert("你好！")
})
```

*   **第一种方式相对直观，编码方便，但一次只能添加一个监听，而且有的监听事件不支持 这种方式。第二种方式则更加通用，且可以添加多个监听。**

```javascript
$('#div1')
    .on('mouseenter', function () {
        console.log('进入')
    })
    .on('mouseleave', function () {
        console.log('离开')
    })

// hover可以一起绑定鼠标进入和出去
$('.inner').hover(function () {
    console.log('进入3')
}, function () {
    console.log('离开3')
})
```

### 操作节点（DOM）

#### DOM操作

*   **jQuery 中的 DOM 操作主要分为内容操作、节点操作和样式操作**
*   **操作内容：** 使用 html()方法来对 HTML 代码进行操作，该方法类似于 JavaScript 中的 innerHTML 属性，通常用于动态新增和替换页面的内容，语法格式：
    `html([content])`
    其中，content 表示可选参数，当有值时表示设定被选元素的新内容，当没有参数时表 示获取被选元素的内容。

```javascript
<script type="text/javascript">
    $(function () {
        $('#btn1').click(function () {
            $('#ans').html("<ul><li>Q1</li><li>Q2</li></ul>")
        })
        $('#btn2').click(function () {
            alert($('#ans').html())
        })
    })
</script>
<body>
    <button id="btn1">点击显示问题</button>
    <button id="btn2">点击弹出问题</button>
    <div id="ans"></div>
</body>
```

（此处需结合幻灯片中的图片讲解：展示点击“点击显示问题”按钮后，页面div中渲染出列表Q1、Q2，点击“点击弹出问题”后弹出对应的HTML代码）

*   **使用 text()方法可以获取或设置元素的文本内容，而不含标签本身**
*   **使用 text()方法设置元素内容时，html 标签也将会转义成普通字符来解析**

```javascript
<script>
    $('#btn3').click(function () {
        alert($('#ans').text())
    })
    
    $('#btn4').click(function () {
        $('#ans').text("<ul><li>Q1</li><li>Q2</li></ul>")
    })
</script>
```

（此处需结合幻灯片中的图片讲解：展示text()方法获取文本时不包含HTML标签，设置文本时将HTML标签作为普通文本显示）

*   **操作value属性值：** jQuery对象的val()方法常用于获取和设置DOM元素的value属性值

```javascript
<script>
    $('#search').
        on("focus", function () {
            if($(this).val() == "请输入内容") {
                $(this).val("")
            }
        }).on("blur", function () {
            if($(this).val() == "") {
                $(this).val("请输入内容")
            }
        })
</script>
<input type="text" value="请输入内容" id="search">
```

（此处需结合幻灯片中的图片讲解：展示图5-7初始文本框状态和图5-8获取焦点时文本框状态）

#### 操作节点

*   DOM 中的节点类型分为元素节点、文本节点和属性节点，文本节点和属性节点又包含在元素节点中。元素节点的操作主要有创建、查找、插入、删除、替换、遍历以及属性节点的获取和设置等操作
*   **创建和插入节点**
    *   以下代码创建了一个 id 为 “city”、内容为 “城市” 的`<li>`元素节点。
    `$("<li id='city'>城市</li>")`
*   **上述代码仅创建了一个新元素，尚未添加到 DOM 中。要想在页面中新增一个节点，则 必须将创建的节点插入到 DOM 中。**

#### 插入节点

*   **jQuery 提供了多种方法来实现节点的插入，从插入方式上来看主要分为两大类：内部插入和平行插入**

**表 5-6 插入节点方法**

| 插入方式 | 方法 | 案例 |
| :--- | :--- | :--- |
| 内部插入 | `append(n)` | `$('F').append('c')`表示将 c 作为子节点插入到 F 的尾部 |
| | `appendTo(n)` | `$('c').appendTo('F')`表示将 c 作为子节点插入到 F 的尾部 |
| | `prepend(n)` | `$('F'). prepend ('c')`表示将 c 作为子节点插入到 F 的首部 |
| | `prependTo(n)` | `$('c'). prependTo ('F')`表示将 c 作为子节点插入到 F 的首部 |
| 平行插入 | `after(n)` | `$('A').after('B')`表示将 B 作为兄弟节点插入到 A 之后 |
| | `insertAfter(n)` | `$('A').insertAfter('B')`表示将 A 作为兄弟节点插入到 B 之后 |
| | `before(n)` | `$('A').before('B')`表示将 B 作为兄弟节点插入到 A 之前 |
| | `insertBefore(n)` | `$('A'). insertBefore ('B')`表示将 A 作为兄弟节点插入到 B 之前 |

```javascript
<script type="text/javascript">
    $(function () {
        $('#btn1').click(function () {
            $('ul').append("<li>复旦大学</li>")
        })
        
        $('#btn2').click(function () {
            $('<li>南开大学</li>').appendTo($('ul'));
        })
    })
</script>
<body>
    <h2>中国著名大学</h2>
    <ul class="univ">
        <li>清华大学</li>
        <li>北京大学</li>
        <li>浙江大学</li>
    </ul>
    <button id="btn1" value="添加节点">添加</button>
    <button id="btn2" value="添加节点 2">appendTo</button>
</body>
```

（此处需结合幻灯片中的图片讲解：展示点击添加按钮后，列表中新增了复旦大学和南开大学）

#### 删除、清空和替换节点

*   **remove()删除节点**
*   **empty()清空节点**
*   **replaceWith()和replaceAll()替换节点，** 前者的作用是将所有匹配的元素替换成指定的节点，replaceAll()方法的作用相同，只是颠倒了replaceWith()方法的操作顺序

```javascript
$('#btn3').click(function () {
    $('ul').remove();
})
$('#btn4').click(function () {
    $('ul').empty();
})
$('#btn5').click(function () {
    $('ul li:last').replaceWith("<li>中国科学院</li>");
})
$('#btn6').click(function () {
    $('<li>国防科大</li>').replaceAll('ul li:last');
})
```

（此处需结合幻灯片中的图片讲解：展示删除、清空列表，以及将最后一项替换为新内容的按钮交互效果）

#### 查找和遍历节点

*   **除了可以使用选择器来查找节点外，还能通过已选择到的元素获取与其相邻的兄弟节点、父子节点等进行二次操作。此类方法中，常见的有 children()、next()、prev()、 siblings()、parent()、parents()等。**

```javascript
var $ul = $('ul')
//1. ul标签的第2个span子标签
$ul.children('span:eq(1)').css('background', 'red')

//2. ul标签的第2个span后代标签
$ul.find('span:eq(1)').css('background', 'red')

//3. ul标签的父标签
$ul.parent().css('background', 'red')

//4. id为cc的li标签的前面的所有li标签
var $li = $('#cc')
$li.prevAll('li').css('background', 'red')

//5. id为cc的li标签的所有兄弟li标签
$li.siblings('li').css('background', 'red')
```

*   **遍历节点是 Web 开发中一个非常重要的功能，常用于在前端页面中遍历服务端传来的数据**

```javascript
$(selector).each(function(index, item))
```

```javascript
$('#btn7').click(function () {
    $("li").each(function (index, item) {
        console.log(item.innerHTML + "===" + index)
    })
})
```

（此处需结合幻灯片中的图片讲解：展示浏览器控制台中打印出每个列表项的内容和对应的索引）

#### 属性节点的操作

*   **在 jQuery 中，有两种常用的操作元素属性的方法，分别为 attr()和removeAttr()方法，前者可以用来获取和设置元素的属性，后者可以用来删除元素的属性**

```javascript
//1. 读取第一个div的title属性
console.log($('div:first').attr('title'))

//2. 给所有的div设置name属性(value为wzu)
$('div').attr('name', 'wzu')

//3. 移除所有div的title属性
$('div').removeAttr('title')

//4. 给所有的div设置class属性
$('div').attr('class', 'box')

// prop(): 专门操作属性值为布尔值的属性
var $checkboxs = $(':checkbox')
$(':button:first').click(function () {
    $checkboxs.prop('checked', true)
})
$(':button:last').click(function () {
    $checkboxs.prop('checked', false)
})
```

### 操作CSS

*   **设置和获取样式**
    jQuery 中常用的设置样式的方法为 CSS()，其基本语法如下所示

    `$(selector).css(name, value)` //设置 CSS 属性

    也可以给 css()方法传多个 name-value 对:

    `$(selector).css({name:value, name:value, ...})`

    `$(selector).css(name)` //获取 CSS 属性

```javascript
<style type="text/css">
    #div1{width: 50px; height: 50px} //css 代码
</style>
<div id="div1">div1</div>
<script>
    $(function () {
        $('#div1').mouseover(function () {
             $('#div1').css("background-color", "red")
        })
    })
    
    $('p:eq(1)').css({
        color: '#ff0011',
        background: 'blue',
        width: 300,
        height: 30
    })
</script>
```

（此处需结合幻灯片中的图片讲解：展示鼠标悬停div变色，以及通过代码设置段落样式的效果）

#### 追加样式

*   **jQuery 中可以用addClass()方法来追加样式**

    `$(selector).addClass(class)` //追加单个样式

    也可以

    `$(selector).addClass(class1 class2...)` //追加多个样式

```javascript
.div2{
    background-color: yellow;
    border: 1px solid
}
// ...
$('#div2').on('mouseover', function () {
    $('#div2').addClass("div1 div2")
})
```

#### 移除样式

*   **jQuery 中可以用removeClass()方法来移除样式**

    `$(selector).removeClass(class)` //移除单个样式

    也可以

    `$(selector).removeClass(class1 class2...)` //移除多个样式

```javascript
$('#div2').on('mouseout', function () {
    $('#div2').removeClass("div2")
})
```

### 表单验证

#### 概述

*   **表单是客户端向服务器端提交数据的主要媒介。** 为了保证表单数据的有效性和准确性， 应用程序在处理业务之前通常需要先对数据进行验证，验证成功后再将数据发送给服务端。
*   **常用的验证方式有客户端验证和服务端验证，** 客户端验证本质上是在当前页面上调用脚本程 序来对表单数据进行验证，而服务端验证则是将请求提交给服务端后，由服务端程序对提交 的表单数据进行验证
*   **客户端验证主要使用JavaScript脚本验证，本章讲述如何使用jQuery进行表单验证**

（此处需结合幻灯片中的图片讲解：展示网易邮箱注册表单的验证界面，包含错误提示信息）

#### 正则表达式

*   **正则表达式是一个描述字符模式的对象，它由一些特殊的符号组成，** 在 JavaScript 中，正则表达式有两种定义方式，一种是普通方式，另一种是构造函数方式。

    `var reg = /模式/修饰符`
    `var reg = new RegExp(“模式”, ”修饰符”)`

*   **修饰符用来扩展表达式的含义**
    *   G：表示全局匹配
    *   I：表示不区分大小写匹配
    *   M：表示可以进行多行匹配

*   **验证**

    `reg.test(字符串)`

```javascript
<script type="text/javascript">
    var reg = /wzu/i
    var s = "wdfdfaawertrfwZudfadfadf"
    alert(reg.test(s))
</script>
```

模式reg用来匹配目标字符串中是否包含 子串“wzu”，修饰符 i 表示匹配过程中忽略大小写。可以看出，此时 test()方法应该返回 true， 而如果没有修饰符 i，则返回 false

```javascript
var reg1 = / ^wzu/gm
var s1 = " wzudfda\nwzu";
alert(s1.replace(reg1, "www"))
```

模式reg1用于匹配以“wzu”开头的字符串。其中字符串 s1 存在符号“\n”是多行字符串，由于加了全局匹配和多行匹配修饰符，该模式会将每一行 作为一个单独的字符串处理，因此上述代码返回结果为“wwwdfda\nwww”，如果不加修饰 符 g，则首次匹配成功后即返回。如果不加修饰符 m，则不支持多行匹配。

#### 表达式的模式

*   **正则表达式的模式一般分为简单模式和复合模式两种。** 简单模式是指通过普通字符的组 合来表达的模式,简单模式只能匹配普通字符串，不能满足复杂需求
*   **复合模式是指通过利用通配符来表达语义的模式**

**表 5-8 正则表达式词符**

| 符号 | 含义 | 示例 |
| :--- | :--- | :--- |
| n? | 匹配 0 次或 1 次字符 n | `/a?/`, 表示匹配出现字符 a 零次或 1 次的字符串 |
| n* | 匹配 0 次或多次字符 n | `/a*/`, 表示匹配出现字符 a 零次或多次的字符串 |
| n+ | 匹配 1 次或多次字符 n | `/a+/`, 表示匹配出现字符 a 一次或多次的字符串 |
| n{x} | 匹配字符 n 出现 x 次 | `/a{3}/`, 表示匹配出现字符 a 三次的字符串 |
| n{x, y} | 匹配字符 n 出现 x 次到 y 次 | `/a{2, 4}/`, 表示匹配出现字符 a 二到四次的字符串 |
| n{x,} | 匹配字符 n 出现>=x 次 | `/a{3, }/`, 表示匹配出现字符 a>=3 次的字符串 |

**表 5-7 正则表达式选择符**

| 符号 | 含义 | 示例 |
| :--- | :--- | :--- |
| [] | 匹配指定集合内的任一个字符 | `/[234]/`, 匹配包含 2 或 3 或者 4 的字符串、`/[0-9]/`表示匹配任意数字、`/[A-Z]/`表示匹配任意大写字母、`/[^A-Z]/`表示匹配非英文字母。 |
| ^ | 匹配字符串的开始 | `/^wzu/`, 匹配以 wzu 开头的字符串 |
| $ | 匹配字符串的结尾 | `/$wzu/`, 匹配以 wzu 结尾的字符串 |
| \d | 匹配一个数字序列 | `/\d/`, 等价于`/[0-9]/` |
| \D | 匹配除了数字之外的任何字符 | `/\D/`, 等价于`/[^0-9]/` |
| \w | 匹配一个数字、下划线或字母 | `/\w/`, 等价于`/[A-z0-9_]/` |
| \W | 匹配任何非单字字符 | `/\W/`, 等价于`/[^A-z0-9_]/` |
| . | 匹配除了换行符之外的任意字符 | `/./`, 等价于`/[^\n\r]/` |

#### 案例：

1）**我国身份证号码的规则为**
    *   15 位或者 18 位
    *   18 位最后一位可能为 X 或者数字

**可定义正则表达式为：**

`var reg = /^\d{15}(\d{2}[0-9xX])?$/`

2）**验证电子邮箱是否符合规则的正则表示可定义如下**

`var reg = /^\w+@\w+(\.[A-z]{2,3}){1,2}$/`

```javascript
$(function () {
    $("input[name='identify']").blur(function () {
        var idf = $(this).val()
        var reg = /^\d{15}(\d{2}[0-9xX])?$/;
        if(reg.test(idf) == false) {
            $("#idfInfo").html("身份证号码不正确，请重新输入")
        }else{
            $("#idfInfo").html("")
        }
    })
})
```

```html
<input type="text" value="请输入身份证" name="identify"> <span id="idfInfo"></span>
```

（此处需结合幻灯片中的图片讲解：展示输入错误身份证号码后，页面上显示“身份证号码不正确，请重新输入”的提示）

### 总结

*   jQuery基本概念
*   jQuery选择器
*   jQuery操作DOM
*   正则表达式
*   jQuery验证表单元素

## 第6章 HTTP协议

### WHY

*   基于HTTP协议的请求和响应是客户端与服务端交互的基础，是所有服务端编程技术的核心
*   对于开发人员来说，只有深入理解HTTP协议，才能更好地开发、维护和管理Web应用

### WHAT

*   HTTP(Hyper Text Transfer Protocol，超文本传输协议)是客户端与服务器双方沟通的语言以及在交互过程中共同遵循的规则
*   客户端先与服务端建立连接，然后向服务端发送请求，称为HTTP请求，服务端接收到HTTP请求后会做出响应，称为HTTP响应
*   目前常用的HTTP版本是HTTP1.1，该版本支持持久连接，也就是在一个TCP连接上可以传送多个HTTP请求和响应，从而减少建立和关闭连接的耗时。

### 例子：假设我们要请求服务端上的资源为一张网页

```html
<body>
    <img src="imgs/img1.jpg">
    <img src="imgs/img1.jpg">
    <img src="imgs/img1.jpg">
</body>
```

1） 上述页面一共会向服务端发送几次请求？
2） 请给出详细请求响应流程？

（此处需结合幻灯片中的图片讲解：展示请求流程图，包括第1次请求返回HTML文本内容，随后第2、3、4次请求分别返回img1.jpg, img2.jpg, img3.jpg）

### 2大特点

*   **快速灵活**
    *   HTTP的简单性保证了客户端与服务端之间的通讯速度很快。另外，HTTP协议允许传输任意类型的数据，使得交互方式十分灵活。
*   **无状态**
    *   HTTP是无状态协议，它规定了服务端程序对于事务处理没有记忆能力。一次交互结束后，如果要处理相同请求则必须重新发送该请求

（此处需结合幻灯片中的图片讲解：展示《大话西游》中孙悟空的剧照，寓意“无状态”或记忆重置）

### HTTP消息

*   HTTP请求消息和HTTP响应消息统称为HTTP消息
*   在HTTP消息中，除了服务器的响应实体内容（HTML页面，图片等）以外，其余信息对用户是不可见的。但对开发者来讲是至关重要
*   chrome浏览器为例，按F12键打开开发者工具并选择Network选项

（此处需结合幻灯片中的图片讲解：展示Chrome浏览器开发者工具Network面板的截图，显示Request URL, Method, Status Code等信息）

*   可以看出，完整的HTTP消息主要包括消息头(Headers)、响应实体内容（Response）和Cookies文件等
*   响应实体内容主要包括HTML内容、CSS内容、JavaScript内容以及图片等资源
*   HTTP消息的消息头部分，主要包括**一般消息头**、**请求消息头**和**响应消息头**（根据chrome浏览器给出的划分）。

### 一般消息头

*   **Request URL**
    *   表示客户端请求的URL地址，该URL内容主要由三种方式来决定：用户直接在浏览器地址栏中输入、超链接跳转以及表单提交
*   **Request Method**
    *   表示客户端向服务发送请求的方式，常用的请求方式主要有GET、POST、PUT、DELETE等4种（ PUT和DELETE通常在Restful风格的HTTP请求中使用）
*   **GET请求：** 1）当用户在浏览器地址栏中输入某个URL地址、2）单击网页上一个超链接时、3） FORM表单的Method属性设置为GET或者不设置method属性（默认值是GET）

```html
<form action="" method="get">
    登录名（文本框）：<input type="text" name="username" value="wzu"> <br>
    密码（密码框）：<input type="password" name="pwd" value=""> <br>
    <input type="submit" value="登录">
</form>
```

*   action属性表示表单提交的URL，空白表示提交给自己

*   **GET请求的主要特点：** 1）请求数据会以参数的形式附加在Request URL后发送给服务端。 2）最多只能传输2K大小的数据（ IE对URL长度的限制是2083字节(2K+35字节) ）

（此处需结合幻灯片中的图片讲解：展示浏览器地址栏中带有参数的URL，如 `.../6-2.html?username=wzu&pwd=1234`）

*   在上述URL中，“？”后面的内容为参数信息。参数是由参数名和参数值构成的，并且中间使用等号（=）进行连接，参数之间用“&”分隔
*   **POST请求**
    *   FORM表单的method属性设置为“POST”，则浏览器将使用POST方式提交表单
    *   把各个表单元素及数据作为HTTP消息的请求头发送给服务器，而不是作为URL地址的参数传递
    *   POST请求理论上对传输的数据大小无限制
    *   数据不显示在地址栏，而是封装成FORM DATA

（此处需结合幻灯片中的图片讲解：展示开发者工具中Headers面板下Form Data部分，显示username: wzu和pwd: 123）

### Status Code

*   表示HTTP响应的状态码，状态码由三位数字组成，表示请求是否被理解或被满足。其中第一个数字定义了响应的类别，有5种可能的取值，后两位没有具体的分类

    *   **1XX** 表示请求已接收，需要继续处理。
    *   **2XX** 表示请求已成功被服务器接收、理解并接受。
    *   **3XX** 为完成请求，服务端需要进一步细化
    *   **4XX** 客户端的请求有错误
    *   **5XX** 服务端出现错误

| 常见状态码 | 说明 |
| :--- | :--- |
| **200** | 客户端请求成功，并正常返回响应结果 |
| **301** | 指定被请求的文档已经被移动到别处 |
| **403** | 服务端理解客户端的请求，但拒绝处理。通常由于权限导致。 |
| **404** | 服务端不存在客户端请求的资源 |
| **500** | 服务端内部错误，通常是指应用程序发生了错误。 |
| **503** | 服务器目前过载或者处于维护状态，不能处理客户端的请求。 |

### 请求消息头

*   请求消息头主要用于向服务端传递附加消息
*   **Accept**
    *   Accept头字段用于表明客户端程序能够处理的MIME类型。MIME是一种互联网标准，它使得浏览器能自动处理从服务端返回的不同类型的数据。

| MIME类型 | 说明 |
| :--- | :--- |
| **Text/html** | 表示客户端可以接收HTML文本 |
| **\*/\*** | 表示客户端可以接受所有格式的内容 |
| **Image/\*** | 表示客户端可以接收所有image格式的子类型 |
| **application/x-gzip** | 表示客户端可以接收GZIP文件 |
| **application/pdf** | 表示客户端可以接收pdf文件 |
| **video/x-msvideo** | 表示客户端可以接收.avi格式的文件 |
| **audio/x-midi** | 表示客户端可以接收MIDI格式的音乐文件 |

*   **Accept-Encoding**
    *   在数据传输过程中对其进行压缩编码可以有效节省网络带宽和传输时间，Accept-Encoding头字段是浏览器发送给服务器，声明客户端能够支持的压缩编码类型

    ```text
    Accept-Encoding: gzip, deflate, br
    ```

    *   服务器接收到这个请求头后，会使用其中指定的一种编码算法对原始文档内容进行压缩编码，然后再将其作为响应消息的实体内容发送给客户端，浏览器接收到压缩后的内容后会自动进行解压缩，进而在浏览器中显示相关内容

*   **Connection**
    *   keep-alive时，客户端和服务器在完成本次交互后继续保持连接
    *   close时，客户端和服务器在完成本次交互后关闭连接
    *   对于HTTP1.1版本来说，默认采用持久链接（keep-alive）

*   **Accept-Language**
    *   Accept-Language 头字段用于指定客户端期望服务端返回哪个国家语言的文档，它的值可以指定多个国家的语言

    ```text
    accept-language: zh-CN,zh;q=0.9
    ```

    zh-CN 表示简体中文，zh 表示中文，zh-CN 在zh 前表示优先支持简体中文。q 是权重系数，且 $0<=q<=1$，q 值越大表示请求越倾向于获得其“；”之前的类型表示内容，若没有指定q 值，则默认为1，因此上述示例等价于：

    ```text
    accept-language: zh-CN;q=1,zh;q=0.9
    ```

    服务器只要检查Accept- Language 请求头中的信息，按照其中设置的国家语言的权重，首先选择返回位于前面的国家语言的网页文档，如果不能返回，则依次返回后面的国家语言的网页文档。

*   **Cache-Control**
    *   Cache-Control 在请求消息中用于通知位于客户端和服务端之间的代理服务器如何使用已缓存的页面，它的值可以是no-cache 和max-age=0
    *   **no-cache** 表示表示不管服务端有没有设置Cache-Control，都必须从重新去获取请求
    *   **max-age=0** 表示不管response 怎么设置，在重新获取资源之前，先检验Last-Modified/ETAG属性，其基本思想是：
        *   客户端请求页面 P
        *   服务端返回页面 P 并在 P 上加上一个 Last-Modified/ETAG 标记
        *   客户端连同页面及 Last-Modified/ETAG 标记记一起缓存
        *   客户端再次请求页面 P 时，会将上次请求时服务端返回的 Last-Modified/ETAG 一起发送给服务端
        *   服务端检查 Last-Modified/ETAG 标记，如果服务器端的资源未修改，直接返回 304 状态码和空响应体，客户端从缓存中获取资源，这样就节省了传输数据量。当服务器端代码发生改变或者重启服务器时，则重新发出资源，返回和第一次请求时类似。从而保证不向客户端重复发出资源，也保证当服务器有变化时，客户端能够得到最新的资源。

*   **Content-Length**
    *   Content-Length头字段在请求消息中用于表示POST请求中请求主体的字节数

*   **Content- Type**
    *   在请求消息中用于表示POST 请求中数据所处的位置，表示请求数据在发送到服务器之前，所有字符都会以“application/x-www-form-urlencoded”进行编码并封装在请求消息中，也就是Form Data中。

*   **Host和Origin**
    *   Host头字段用于指定请求资源所在的位置，通常包括，且仅仅包括域名和端口号。Origin用于指定请求从哪里发起的，通常包括协议名、域名和端口号，比如 http://localhost:8080

*   **Refer**
    *   浏览器向服务器发送请求，可能是直接在浏览器中输入URL 地址来发出，也可能是单击一个网页上的超链接或提交表单而发出。对于上述第一种情况，浏览器不会发送Refer 请求头，而对于第二种情况浏览器会使用Refer 头字段标识发出请求的超链接所在网页的URL
    *   例如在6-3.html 中点击“注册”按钮向服务端发送POST 请求，浏览器会在发送的请求消息中包含Refer 头字段

    ```text
    Referer: http://localhost:8080/chap06/6-3.html
    ```

*   **User-Agent**
    *   指定浏览器使用的操作系统版本、浏览器及版本、浏览器渲染引擎和语言等

    ```text
    User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36
    (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36
    ```

### 响应消息头

*   **Content-Type**
    *   用于指定响应实体内容的MIME类型，客户端通过检查该字段中的MIME类型，就能知道接收到的实体内容代表哪种格式的数据类型，从而进行正确的处理
    *   服务器会在配置文件中配置文件扩展名与MIME类型的映射关系，从而可以根据资源的扩展名自动确定MIME类型（WEB.XML）

    ```xml
    <mime-mapping>
        <extension>doc</extension>
        <mime-type>application/msword</mime-type>
    </mime-mapping>
    ```

    *   例子：在http目录下创建一个内容为空的word文件，文件名为test.doc，在地址栏输出 `http://localhost:8080/chap06/test.doc`，此时由于服务器会告诉浏览器响应实体的MIME类型为“application/msword”，因此浏览器会以文件下载的形式处理响应消息

*   **Data和Expires**
    *   Data头字段用于表示HTTP消息产生的当前时间
    *   Expires用于指定当前文档的过期时间，浏览器在这个时间以后不能再继续使用本地缓存，而需要向服务器发送新的访问请求
    *   由于浏览器的兼容问题，在设置网页不缓存时，一般将Progma、Cache-Control和Expires三个头字段一起使用

*   **Etag 和Last-Modified**
    *   Etag 头字段用于向客户端传送代表实体内容特征的标记信息，这些标记信息称为实体标签，通过实体标签可以判断在不同时间获得的统一资源路径下的实体内容是否相同
    *   Last-Modified用于指定文档最后的更改时间，当客户端接收到该头字段后，将在以后的请求消息中发送一个If-Modified-Since 请求消息头来指出缓存文档的最后更新时间来决定是否需要重新发送请求。

### 总结

*   HTTP概念及其特点
*   HTTP消息
*   请求头消息
*   get请求
*   post请求
*   响应头消息

## 第7章 SERVLET技术基础

### SERVLET 简介

*   Servlet 是一种运行在Web 服务端的Java 应用程序,属于客户端请求和服务端数据库或应用程序之间的中间层，负责接收、响应客户端请求，与业务层交互。
*   常见的Servlet 容器有Tomcat、Jetty、WebLogic 及JBoss

（此处需结合幻灯片中的图片讲解：展示Web服务器架构图，浏览器通过http协议请求Web服务器，Web服务器与Servlet容器交互，Servlet程序连接数据库）

### 搭建开发环境

*   动态Web程序（服务端-客户端交互，页面内容动态变化）具备一定的结构，手动创建不方便。

（此处需结合幻灯片中的图片讲解：展示IntelliJ IDEA新建项目界面，选择Java Enterprise，勾选Web Application）

*   **输入工程名字**：例如 `servlet`
*   **配置输出路径**：
    *   Output path: `D:\workspace\Java\servlet\web\WEB-INF\classes`
    *   Test output path: `D:\workspace\Java\servlet\web\WEB-INF\classes`
    *   勾选 Exclude output paths

（此处需结合幻灯片中的图片讲解：展示Project Structure中的Paths配置界面）

*   **添加依赖**：选择Jar目录：表示该文件夹为Jar包存放目录

（此处需结合幻灯片中的图片讲解：展示Project Structure中的Dependencies配置界面）

### 启动并配置TOMCAT

*   点击IDEA 右上角三角形在Tomcat 服务器中部署并运行当前Web 工程
*   配置（Run-> Edit Configurations）

（此处需结合幻灯片中的图片讲解：展示IDEA工具栏的运行按钮和Run/Debug Configurations配置窗口，重点指出Deployment选项卡和Application context的配置）

### 第一个SERVLET程序

*   **本质就是Java程序（src文件夹）**
*   右键选择“servlet”，在弹出的对话框中输入该Servlet的名字，例如“HelloServlet”点击OK
*   **默认生成代码**
    *   继承了类HttpServlet，这是一个普通类称为Servlet的必要条件
    *   注解`@WebServlet`的name属性用于指定当前Servlet的名称
    *   `doPost()`方法用于处理客户端发送的POST方式请求
    *   `doGet()`方法用于处理客户端发送的GET方式请求

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
}

protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    System.out.println("Hello World....");
}
```

*   **添加URL访问路径（名字可任意）**
    *   在`@WebServlet`注解中添加了“urlPatterns”属性并将值设为“/hello”

```java
@WebServlet(name = "HelloServlet", urlPatterns = "/hello")
```

*   在`doGet()`方法中添加的代码表示当该Servlet接收到客户端发送的GET方式请求时，会调用`doGet()`方法处理请求。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    System.out.println("第一个servlet程序。。。");
}
```

*   在浏览器地址栏输入：`http://localhost:8080/hello`并回车

（此处需结合幻灯片中的图片讲解：展示IDEA控制台输出“第一个servlet程序。。。”的日志信息）

### 客户端访问SERVLET流程

*   首先接收到浏览器发送的HTTP 请求（GET 方式），由于不是访问静态资源，因此Apache 服务器将请求交给Servlet 容器处理（此处为Tomcat服务器），Tomcat 服务器将请求的URI（/hello）映射到url-pattern 属性值为该URI 的Servlet，然后调用该Servlet 的doGet()方法处理请求（此处在服务端控制台打印信息，并无相关资源返回给客户端）

（此处需结合幻灯片中的图片讲解：展示客户端请求经过Web服务器、Servlet容器、URL映射最终调用Servlet实例的流程图）

### 基于WEB.XML配置

*   除了使用注解的方式外，常见的配置映射路径的方法还有配置`web.xml`文件的方式

```xml
<servlet>
    <servlet-name>HelloWorld</servlet-name>
    <servlet-class>chap07.HelloServlet</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>HelloWorld</servlet-name>
    <url-pattern>/hello</url-pattern>
</servlet-mapping>
```

### SERVLET生命周期

*   所谓Servlet的生命周期是指Servlet对象从创建到销毁的过程
*   默认情况下，Servlet 对象从Servlet 容器接收到HTTP 请求开始创建，到服务器关闭或Web 应用被移出容器时销毁

（此处需结合幻灯片中的图片讲解：展示Servlet生命周期流程图，包括初始化调用init()，处理请求调用service()，销毁阶段调用destroy()）

*   **初始化阶段**
    *   当Servlet容器接收到客户端发来的HTTP请求要访问某个Servlet时，首先会检查内存中是否已经有了该Servlet对象，如果有就直接使用该Servlet对象，如果没有就创建Servlet实例对象，然后通过调用`init()`方法来实现Servlet的初始化工作。`Init()`方法在整个生命周期过程中只被调用一次。

*   **运行阶段**
    *   Servlet容器会将HTTP请求和响应封装成Java对象并作为参数传给`service()`方法，`service()`方法会根据HTTP请求的类型来决定调用`doGet()`方法或`doPost()`方法来处理业务逻辑，然后将响应结果返回给客户端。

> **注意：** Servlet容器对于每一次访问请求，都会调用一次service()方法，但实际开发中，通常只需要关注doGet()和doPost()方法，而较少关注service()方法本身。

*   **销毁阶段**
    *   当服务器关闭或者Web应用被移出Servlet容器时，Servlet对象被销毁。在销毁之前，容器会调用Servlet的`destory()`方法，以便让Servlet对象释放它所占用的资源。

*   **例子：LifeCycleServlet.java**

```java
@Override
protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    System.out.println("step2: 调用service方法");
    super.service(req, resp);
}

@Override
public void destroy() {
    System.out.println("step4: 调用destroy方法");
    super.destroy();
}

@Override
public void init() throws ServletException {
    System.out.println("step1: 调用init方法");
    super.init();
}
```

*   除了在Servlet被访问时创建对象之外，还可以配置某些Servlet在容器启动时创建（只需要在`@WebServlet`注解中添加属性 `loadOnStartup=1` 即可）

```java
@WebServlet(name = "LifeCycle", urlPatterns = "/lifecycle", loadOnStartup = 1)
```

*   **XML配置方式**
    *   在实际开发中，除了使用注解的方式外，常见的配置映射路径的方法还有配置web.xml文件的方式

```xml
<servlet>
    <servlet-name>hello</servlet-name>
    <servlet-class>servlet.HelloServletXML</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>hello</servlet-name>
    <url-pattern>/helloXML</url-pattern>
</servlet-mapping>
```

*   **注意：注解和XML配置文件的方式只能用一种**

*   当停止服务器或者将该工程从Tomcat 容器中移出，控制台会打印“Servlet 被销毁”。

（此处需结合幻灯片中的图片讲解：展示IDEA控制台日志，显示Servlet被创建、doGet方法被Service方法调用等信息）

### SERVLET常用对象

### SERVLETCONFIG

*   当Servlet容器初始化一个Servlet时，会将该Servlet的相关配置信息封装到一个ServletConfig对象中，通过调用`init(ServletConfig config)`方法将ServletConfig对象传递给Servlet使得Servlet在构造对象时可以利用配置的初始化信息。

| 方法说明 | 功能描述 |
| :--- | :--- |
| `String getInitParameter(String name)` | 根据初始化参数名返回对应的初始化参数值 |
| `Enumeration getInitParameterNames()` | 返回一个Enumeration对象，其中包含所有的初始化参数名 |
| `ServletContext getServletContext()` | 返回一个代表当前 Web 应用的ServletContext对象 |
| `String getServletName()` | 返回Servlet的名字 |

*   **例子：ServletConfigTest.java**

```java
@WebServlet(name = "ServletConfigTest",
    urlPatterns = "/config",
    initParams = {
        @WebInitParam(name = "encoding", value = "utf-8"),
        @WebInitParam(name = "password", value = "666")
    })

// ... 省略部分代码

@Override
public void init(ServletConfig config) throws ServletException {
    System.out.println(config.getInitParameter("encoding"));
    System.out.println(config.getInitParameter("password"));
}
```

**说明：** 上述代码将初始化信息封装在config对象中，传给servlet。可以利用该对象`getInitParameter()`方法取出来。

*   **XML的方式**

```xml
<servlet>
    <servlet-name>Config</servlet-name>
    <servlet-class>com.web.chap07.ServletConfigDemo</servlet-class>
    <init-param>
        <param-name>Encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
</servlet>
<servlet-mapping>
    <servlet-name>Config</servlet-name>
    <url-pattern>/config</url-pattern>
</servlet-mapping>
```

**方法同上**

### SERVLETCONTEXT

*   当Servlet容器启动时，会为每个Web应用创建一个唯一的ServletContext对象代表当前Web应用，该对象不仅封装了当前Web应用的所有信息，而且实现了多个Servlet之间数据的共享。

*   **实例1：读取web应用的配置信息（web.xml中配置）**

```xml
<context-param>
    <param-name>appName</param-name>
    <param-value>javaweb</param-value>
</context-param>
```

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) ... {
    ServletContext context = this.getServletContext(); // 获取ServletContext
    Enumeration<String> paramNames = context.getInitParameterNames();
    while (paramNames.hasMoreElements()){
        String name = paramNames.nextElement();
        String value = context.getInitParameter(name);
        System.out.println(name + "-------" + value);
    }
}
```

*   **实例2：实现多个servlet之间共享**
    *   一个Web应用中所有Servlet共享同一个ServletContext对象
    *   设置ServletContext域属性的4个方法

| 方法说明 | 功能描述 |
| :--- | :--- |
| `Enumeration getAttributeNames()` | 返回一个Enumeration对象，该对象包含所有存放在ServletContext中的所有域属性名 |
| `Object getAttribute(String name)` | 根据参数指定的属性名返回相应的属性值 |
| `Void removeAttribute(String name)` | 根据参数指定的属性名删除相应的域属性 |
| `Void setAttribute(String name, Object obj)` | 设置域属性，其中name是属性名，obj是属性值 |

*   **例子： ServletContextShare1.java, ServletContextShare2.java**

```java
// ServletContextShare1.java
@WebServlet(name = "ServletContextShare1", urlPatterns = "/share1")
public class ServletContextShare1 extends HttpServlet {
    protected void doGet(...) {
        this.getServletContext().setAttribute("data", 1);
    }
}

// ServletContextShare2.java
@WebServlet(name = "ServletContextShare2", urlPatterns = "/share2")
public class ServletContextShare2 extends HttpServlet {
    protected void doGet(...) {
        ServletContext sc = this.getServletContext();
        System.out.println(sc.getAttribute("data"));
    }
}
```

### 请求和响应对象

#### HTTPSERVLETREQUEST

*   HttpServletRequest对象，专门用来封装HTTP请求消息，该对象定义了一系列用于获取**请求头**和**请求体**的相关方法（程序中控制HTTP请求）。

*   **获取请求消息头**

| 方法声明 | 功能描述 |
| :--- | :--- |
| `String getMethod()` | 获取HTTP的请求方式（如GET，POST等） |
| `String getRequestURI()` | 获取URL请求的资源名称部分，即位于URL的主机和端口号之后，参数之前的部分 |
| `String getQueryString()` | 获取URL请求的参数部分，也就是URL中问号（？）后面的所有内容 |
| `String getContextPath()` | 获取URL中Web应用程序的路径。以“/”开头 |
| `String getServletPath()` | 获取URL中Servlet所映射的路径 |
| `Enumeration getHeaderNames()` | 获取所有请求头的名称 |
| `String getHeader(String name)` | 获取一个指定名称的头字段的值 |
| `String getCharacterEncoding()` | 获取请求实体部分的字符集编码 |

*   **例子：HttpServletRequestTest.java**

（此处需结合幻灯片中的图片讲解：展示浏览器请求`/request1`后，控制台输出的host, user-agent, accept-encoding等请求头信息）

*   **获取请求消息体**
    *   **获取请求参数**
    *   开发中，经常需要获取用户的表单数据，如用户名、密码等，使用HttpServletRequest对象中的方法可以很方便的获取请求参数
    *   `getParameter()` 和 `getParameterValues()`

*   **例子： form.html** (注意action的内容，已经修改过默认根路径)

```html
<form action="/wzu/request" method="post">
    用户名： <input type="text" name="username"> <br>
    密码： <input type="password" name="pwd"> <br>
    爱好：
    <input type="checkbox" name="hobby" value="sing">唱歌
    <input type="checkbox" name="hobby" value="dance">跳舞
    <input type="checkbox" name="hobby" value="basketball">篮球 <br>
    <input type="submit" value="提交">
</form>
```

*   **post请求，要注意用doPost()处理**

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) ... {
    System.out.println(request.getParameter("username"));
    System.out.println(request.getParameter("pwd"));
    
    String[] hobbys = request.getParameterValues("hobby");
    for(String s : hobbys){
        System.out.print(s + " ");
    }
}
```

（此处需结合幻灯片中的图片讲解：展示表单提交后，控制台打印出的用户名、密码及选中的爱好）

*   **请求乱码**
    *   上述例子中如果填的是中文，则出现以下结果（乱码问号）
    *   因为浏览器发送请求时，默认采用的编码是GBK，解码时默认编码是ISO-8859-1，所以乱码
    *   **使用HttpServletRequest对象的setCharacterEncoding()方法解决**

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) ... {
    request.setCharacterEncoding("utf-8");
    // ... 获取参数代码
}
```

*   **GET请求乱码解析**
    *   对含中文的参数进行“先编码，后解码”

```java
// 获取请求参数
String username = req.getParameter("username");
// 1 先以 iso8859-1 进行编码
// 2 再以 utf-8 进行解码
username = new String(username.getBytes("iso-8859-1"), "UTF-8");
```

#### 请求转发（重点）

*   在Servlet 中，当一个Web 资源收到了客户端请求后，如果希望服务器通知另外一个servlet 去处理请求， 或者希望将请求的数据转发到页面上显示时， 可以通过获取RequestDispatcher 对象并调用`forward()`方法实现请求转发。

（此处需结合幻灯片中的图片讲解：展示请求转发的原理图，Browser发送请求 -> Servlet1 (request) -> 转发 -> Servlet2 (response)）

*   **RequestForwardServlet1.java**

```java
// ...
// 获取请求的参数
String username = request.getParameter("username");
System.out.println("在 Servlet1 中查看参数：" + username);
// 将数据保存到 request 对象中
request.setAttribute("School", "温州大学");
// 获取 RequestDispatcher 对象
RequestDispatcher requestDispatcher = request.getRequestDispatcher("/forwardServlet2");
// 转发，当前请求和响应对象作为参数传递
requestDispatcher.forward(request, response);
```

*   **RequestForwardServlet2.java**

```java
// ...
// 获取请求参数
String username = request.getParameter("username");
// 获取 request 对象中保存的数据（多个资源可共享）
String schName = (String) request.getAttribute("School");
System.out.println("Servlet1 保存的数据是：" + schName);
System.out.println("Servlet2 处理自己的业务");
```

*   **启动Tomcat 服务器，在浏览器中输入** `http://localhost:8080/forwardServlet1?username='jason'` **访问Servlet1**

（此处需结合幻灯片中的图片讲解：展示控制台输出信息，证明Servlet1和Servlet2都已被执行且数据共享）

*   **请求转发方式的五大特点：**
    1.  浏览器地址栏没有变化，当 Servlet1 将请求转发到 Servlet2 后，浏览器地址栏并没有改变。原因是请求转发属于服务器內部的行为，作为客户端的浏览器并不知晓服务端内部的变化。
    2.  不管服务端请求转发了多少次，对于客户端来讲都属于 1 次请求。客户端从发送请求开始到接收到服务端响应这一过程都属于一次请求范围。
    3.  转发的 servlet 之间共享 request 域对象中的数据。上例中 Servlet1 中的保存的数据，Servlet2 中也可以访问。
    4.  可以转发到 WEB-INF 目录下的页面文件中，这一应用方式在 Web 开发中更为常见，具体将在下一章中讲述。
    5.  不可以访问工程以外的资源。请求转发只能发生在同一个工程中的不同 Web 资源之间。

#### HTTPSERVLETRESPONSE

*   HttpServletResponse对象用于封装响应信息
*   **向客户端响应数据**
    *   `getOutputStream()`：字节流（传图片、音频、视频等多媒体数据）
    *   `getWriter()`：字符流（传文本数据）
*   **例子： ResponseTestServlet.java**

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) ... {
    String text = "i am a text data... wzu , 17jiben, i love you guys";
    PrintWriter print = response.getWriter();
    print.write(text);
}
```

*   **响应中文乱码问题**
    *   原因：数据在网络中传输是按字节传输，字符转字节称为编码（默认使用ISO-8859-1），浏览器接收到数据需要解码（默认使用GB2312）

*   **解决方法：**
    1.  **设置编码方式**

    ```java
    response.setCharacterEncoding("utf-8");
    ```

    2.  **浏览器设置解码方法（chrome浏览器安装charset插件）设置成utf-8**

    （此处需结合幻灯片中的图片讲解：展示浏览器通过插件修改页面编码的操作）

    3.  **方法2：让服务器告诉浏览器使用指定编码来解码**

    ```java
    response.setHeader("content-type", "text/html;charset=UTF-8");
    // 或者
    response.setContentType("text/html;charset=UTF-8"); // 常用简写方式（PPT代码为setHeader和setCharacterEncoding组合，这里补充常用方式）
    response.setCharacterEncoding("utf-8");
    ```

*   **应用1：页面定时、自动刷新（旅游、机票、火车票等）**
    *   例子： ResponseRefleshServlet.java

    ```java
    response.setHeader("Refresh", "1");
    response.getWriter().write(new Date().toString());
    ```

*   **应用2：请求重定向**
    *   例子： 用户登录（用户名密码正确，跳转到欢迎页面）
    *   login.html, welcome.html, LoginServlet.java

    ```java
    if("jason".equals(username) && "123".equals(pwd)) {
        // response.sendRedirect("/wzu/welcome.html");
        response.sendRedirect("welcome.html");
    } else {
        response.sendRedirect("login.html");
    }
    ```

*   **请求重定向原理图**
    *   服务端先返回url，客户端重新发送请求
    *   用户登录例子中，客户端点“提交”一共发出2个请求
    *   地址栏发生变化（why?）

（此处需结合幻灯片中的图片讲解：展示请求重定向原理图，Client请求Servlet1 -> Servlet1响应302和新URL -> Client请求Servlet2 -> Servlet2响应结果）

*   **请求重定向本质上不同于请求转发，它具备以下几个特点**
    *   浏览器地址栏会发生变化。原因是请求重定向会告知客户端浏览器重新定位的 URL 地址，浏览器会根据该 URL 地址重新发送请求。
    *   客户端发送了两次请求。客户端第一次请求原资源后，根据 sendRedirect()方法返回的 URL 路径，重新发送第二次请求。
    *   不共享 request 域对象中的数据。根据 HTTP 请求的无记忆性特点，第一次请求给服务端发送的数据不能在第二次请求中访问。如上例中第一次请求会给服务端发送表单数据，而在第二次请求中便无法访问该表单数据。
    *   不能访问 WEB-INF 下的资源。由于 WEB-INF 下的资源对客户端是访问保护的，即使服务端告知浏览器 WEB-INF 目录下资源路径，浏览器也无法访问。因此，要想访问 WEB-INF 目录下的资源，则必须使用请求转发。
    *   可以访问当前工程以外的资源。由于请求重定向属于客户端跳转，因此只要知道目标资源的绝对路径，便可以访问，无需保证资源在同一个项目工程中。

### 文件上传和下载

#### 文件上传

*   **原理：二进制流数据**
    *   **文件上传**：文件上传指的是通过浏览器向服务器上传某个文件，服务器 接收到该文件后会将该文件存储在服务器的硬盘中，通常不会存在 数据库，这样可以 减轻数据库的压力并且在文件的操作上 更加灵活，常见的功能是上传头像图片。
    *   **文件上传的原理**：服务器端通过 request对象 获取输入流，将浏览器 端上传的 数据读取 出来，保存到 服务器端
    *   **文件上传的要求**
        *   提供form表单，表单的提交方式 必须是post
        *   form表单中的 enctype 属性 必须是mutipart/form-data
        *   表单中 提供 input type="file"上传 输入域

```html
<form action="/wzu/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="photo"><br>
    <input type="submit" value="上传"><br>
</form>
```

*   **使用上传工具**
    *   处理表单文件上传的开源组件(Commons-fileupload),该组件性能优异，并且其API使用极其简单，可以让开发人员轻松实现Web文件上传功能，首先 需要导入Commons-fileuploads和commons-io两个jar包
    *   **使用方法**：拷贝到lib目录下，右键“add to libaray”，展开能看到如下界面（导包原理：很多可使用的类）

（此处需结合幻灯片中的图片讲解：展示IDEA项目中导入Jar包后的目录结构）

*   **创建FileUploadServlet.java**
*   **上传原理**

（此处需结合幻灯片中的图片讲解：展示Commons-fileupload解析原理流程图，包括request -> ServletFileUpload -> FileItem -> DiskFileItemFactory）

*   **注意idea中需要在/upload目录下先放入一个文件**

*   **补充：**
    1.  **临时文件**
        *   文件由浏览器通过网络上传到服务器，并不是直接通过一条网络线路将所有请求数据发送到了服务器的。而是将这些数据分为了很多个数据包，这些数据包分别被编号后，经由不同的网络线路最终发送到了服务器中。这些数据包到达服务器的时间会根据不同的网络线路的情况不同，分别先后到达服务器，顺序是不定的。因此服务器会在其临时目录中，创建一个临时文件，将这些数据包进行拼接组装。
    2.  **文件重命名问题**
        *   如果当前服务器有一个文件名字为my.jpg，当用户在此上传同名文件时，会将之前的文件覆盖。
        *   可以给文件名添加系统时间
        *   可以给文件名添加UUID

```java
//重命名文件名
fileName = fileName.substring(fileName.lastIndexOf("\\") + 1);
//在文件名中添加系统时间
fileName = System.currentTimeMillis() + "_" + fileName;
//在文件名中添加uuid
fileName = UUID.randomUUID() + "_" + fileName;
```

#### 文件下载

1.  **超链接+Servlet实现**

```html
<a href="/wzu/download?filename=shuaige1.jpg">下载图片</a>
<a href="/wzu/download?filename=bootstrap-3.3.7-dist.zip">下载bootstrap压缩包</a>
```

2.  **原理**
    *   发送二进制数据，一般应用在文件下载
    *   提供文件（所有web资源放到WebContent目录下）
    1.  获取要下载的文件的绝对路径
    2.  获取要下载的文件名
    3.  设置content-disposition响应头控制浏览器以下载的形式打开文件
    4.  获取要下载的文件输入流
    5.  创建数据缓冲区
    6.  通过response对象获取OutputStream流
    7.  将FileInputStream流写入到buffer缓冲区
    8.  使用OutputStream将缓冲区的数据输出到客户端浏览器

```java
// 先获取请求的文件名
String filename = request.getParameter("filename");
// 设置响应头属性值
response.setHeader("content-disposition", "attachment;filename=" + filename);

// 获取输入流
InputStream is = this.getServletContext().getResourceAsStream("/upload/"+filename);
ServletOutputStream os = response.getOutputStream();

// 复制文件
byte[] bytes = new byte[1024];
int len = 1;
while((len = is.read(bytes)) != -1) {
    os.write(bytes, 0, len);
}
os.close();
```

### 总结

1.  **Servlet是什么？作用？**
    1.  `url-pattern`
2.  **请求类型**
    1.  Get和Post
3.  **如何接受客户端请求数据？**
    1.  `Request.getParameter();`
4.  **跳转类型**
    1.  服务端跳转和客户端跳转
5.  **如何给客户端发送数据？**
    1.  Response对象
6.  **如何获取初始化信息？**
    1.  servletConfig对象

### 重点

*   **当客户端请求到达Servlet容器（Tomcat）时：**
*   **根据URL MAPPING访问相应的Servlet**
*   **第一次被访问时，会实例化对象（2次以上不会，线程安全问题？） 后续再理解**
*   **对象调用service()方法（内部调用，知道就行）**
*   **service()方法根据请求类型访问doGet()或者doPost()方法做相应处理**

## 第8课 JSP技术

### WEB开发中角色

*   **JSP（Java Server Page）技术在当前Web开发中，主要用于动态显示数据（用户登录为例）**
    *   能在html页面中嵌入Java代码（`<% java代码 %>`）
    *   能在html页面中用JSP表达式动态显示数据
*   **本质上也是Servlet（WHY JSP?）**

```html
<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>显示系统时间</title>
</head>
<body>
    <h2>当前访问的时间是： <%= new Date() %></h2>
</body>
</html>
```

（此处需结合幻灯片中的图片讲解：展示浏览器访问hello.jsp页面，显示当前系统时间的运行结果）

### Servlet版本

```java
@WebServlet(name = "SystemTimeServlet", urlPatterns = "/time")
public class SystemTimeServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Date date = new Date();
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write("<!DOCTYPE html>\r\n");
        writer.write(" <html lang=\"en\">\r\n");
        writer.write(" <head>\r\n");
        writer.write(" <meta charset=\"UTF-8\">\r\n");
        writer.write(" <title>显示系统时间</title>\r\n");
        writer.write(" </head>\r\n");
        writer.write(" <body>\r\n");
        writer.write(" <h2>当前访问时间是： " + date + "</h2>\r\n");
        writer.write(" </body>\r\n");
        writer.write("</html>\r\n");
        writer.write("\r\n");
    }
}
```

### JSP运行原理

**JSP的运行模式与Servlet一样，都是请求/响应模式，不同的是Servlet需要配置请求路径，而JSP直接对应文件路径，无须配置。**

（此处需结合幻灯片中的图片讲解：展示JSP容器(Tomcat)的处理流程图：①请求 -> JSP文件 -> ②转换 -> Servlet源码文件 -> ③编译 -> Servlet字节码 -> ④执行 -> Servlet实例 -> ⑤生成 -> 响应结果 -> ⑥响应）

### JSP基本原理（了解）

*   JSP页面是动态资源（Tomcat管理）
*   Servlet映射，JSP如何映射？
*   查看Tomcat的`web.xml`文件
*   **浏览器请求JSP页面，其实都需要经过JspServlet的处理**

```xml
<servlet>
    <servlet-name>jsp</servlet-name>
    <servlet-class>org.apache.jasper.servlet.JspServlet</servlet-class>
    <!-- ... -->
</servlet>
<servlet-mapping>
    <servlet-name>jsp</servlet-name>
    <url-pattern>*.jsp</url-pattern>
    <url-pattern>*.jspx</url-pattern>
</servlet-mapping>
```

*   **当访问一个jsp页面时， JspServlet会先把jsp翻译成一个Servlet源文件**
    *   在Tomcat服务器的 `work\Catalina\localhost\项目名\org\apache\jsp` 目录下（一般）
    *   `C:/Users/登录名/.IntelliJIdea2018.2/system/tomcat/Tomcat-pure_工程名/work/Catalina/localhost/appcontext名称/org/apache/jsp` （IDEA中）

（此处需结合幻灯片中的图片讲解：展示文件资源管理器中生成的 hello_jsp.class 和 hello_jsp.java 文件）

*   **该Servlet继承HttpJspBase类（继承HttpServlet）**
*   **会先调用父类（ HttpServlet ）中的service()方法，调用_jspService()方法**

```java
public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
    throws java.io.IOException, javax.servlet.ServletException {
    // ...
    try {
        response.setContentType("text/html;charset=UTF-8");
        // ...
        out.write("\r\n");
        out.write("\r\n");
        out.write("<html>\r\n");
        out.write("<head>\r\n");
        out.write("    <title>显示系统时间</title>\r\n");
        out.write("</head>\r\n");
        out.write("<body>\r\n");
        out.write("    <h2>当前访问的时间是： ");
        out.print( new Date());
        out.write("</h2>\r\n");
        out.write("</body>\r\n");
        out.write("</html>\r\n");
    } catch (java.lang.Throwable t) {
        // ...
    }
}
```

### JSP基础语法

*   **在 JSP 文件中可以嵌套很多内容，例如 JSP 指令、JSP 表达式、JSP 脚本、JSP 注释、 JSP 内置对象及 JSP 标签等，这些内容的编写都需要遵循一定的语法规范**

### JSP指令简介

*   **指令告诉引擎如何处理JSP页面中的其余部分**
    *   page指令
    *   include指令
    *   taglib指令（后讲）
*   **JSP指令的基本语法格式：** `<%@ 指令 属性名="值" %>`
*   **page指令用于定义JSP页面的各种属性**
    *   `<% @page 属性名=“属性值” %>`
    *   `<%@ page contentType="text/html;charset=UTF-8" language="java" %>`
*   **Page指令作用2： 导入Java包**
    *   `<%@ page import="java.util.Date" %>`

#### 异常处理示例

**page.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page errorPage="error.jsp" %>
<html>
<head>
    <title>发生异常页面</title>
</head>
<body>
    <%
        int x = 100/ 0;
    %>
</body>
</html>
```

**error.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>错误处理页面</title>
</head>
<body>
    <h2>抱歉！服务器故障，请稍微访问。</h2>
</body>
</html>
```

（此处需结合幻灯片中的图片讲解：展示发生除零异常后跳转显示的“抱歉！服务器故障...”页面）

#### 全局异常处理

**web.xml:**

```xml
<error-page>
    <error-code>404</error-code>
    <location>/400.jsp</location>
</error-page>
```

**400.jsp / 500.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>404错误</title>
</head>
<body>
    <h2>发生404错误处理页面</h2>
</body>
</html>
```

（此处需结合幻灯片中的图片讲解：展示浏览器访问不存在的页面 hoPage.jsp 时显示的“发生404错误处理页面”结果）

### JSP指令简介（2）

*   **include指令**
    *   include指令用于引入其它JSP页面，如果使用include指令引入了其它JSP页面，那么JSP引擎将把这两个JSP翻译成一个servlet。所以include指令引入通常也称之为静态引入
    *   **语法：** `<%@ include file="relativeURL"%>`

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>include 指令</title>
</head>
<body>
    我是 include 页面，包含了 hello.jsp 页面
    <%@include file="hello.jsp"%>
</body>
</html>
```

（此处需结合幻灯片中的图片讲解：展示页面同时显示了文本内容和被包含页面 hello.jsp 中的时间显示）

### JSP基本语法 - 表达式与脚本

#### JSP表达式

*   **JSP脚本表达式（expression）用于将程序数据输出到客户端**
*   **语法：** `<%= 变量或表达式 %>`
*   **举例：输出当前系统时间:**
    *   `<%= new java.util.Date() %>`
*   **输出登陆的用户名（servlet的例子）**
    *   `<%= request.getAttribute(“username”)%>`

#### JSP脚本片段

*   **是指嵌套在 `<% %>` 中的 Java 程序代码，这些 Java 代码必须严格遵守 Java 语法规范，否则编译会报错**

```html
<%
    int x = 10;
    String str = "你好";
    List<Employee> emps = new ArrayList<>();
    for (int i = 0; i <= 5; i++) {
        emps.add(new Employee(i, "emp"+i, 18+i, "emp" + i + "@163.com"));
    }
%>
```

**例：所有员工数据以表格的形式展现在页面中**

```html
<table border="1">
    <thead>
        <tr><td>ID</td><td>姓名</td><td>年龄</td><td>邮箱</td></tr>
    </thead>
    <tbody>
    <%
        for (int i = 0; i<emps.size(); i++){
            Employee emp = emps.get(i);
    %>
        <tr>
            <td><%= emp.getId() %></td>
            <td><%= emp.getName() %></td>
            <td><%= emp.getAge() %></td>
            <td><%= emp.getEmail() %></td>
        </tr>
    <%
        }
    %>
    </tbody>
</table>
```

*   需要注意的是，当页面结构比较 复杂时，JSP 脚本片段与 HTML 标签等其他元素嵌套使用，容易使得页面结构混乱

### JSP注释

*   **同任何其他编程语言一样，JSP 也有自己的注释方式**

    `<%-- 注释信息--%>`

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>JSP 注释</title>
</head>
<body>
    <%--这是 JSP 注释信息--%>
    <!--这是 HTML 注释信息-->
</body>
</html>
```

（此处需结合幻灯片中的图片讲解：展示JSP源码和浏览器查看源文件的对比，HTML注释存在而JSP注释消失）

**JSP 注释语法与 HTML 注释语法很类似，但两者的区别在于，HTML 注释会被 Tomcat 当做普通文本解释执行后发送到客户端，而 JSP 在被翻译成 Servlet 时，其页面的注释信息 会被忽略**

### JSP九大对象

*   **Web服务器在调用jsp时，会给Jsp提供如下的九个java对象（无需声明，直接使用）**

| 内置对象名称 | 描述 |
| :--- | :--- |
| out | 用于页面输出 |
| request | 客户端请求对象，用于获取用户请求信息，同 HttpServletRequest 对象 |
| response | 服务端响应信息对象，同 HttpServletResponse 对象 |
| config | 服务端配置，用于获取初始化参数，tong ServletConfig 对象 |
| session | 回话对象，用于保存回话范围内的数据，同 HttpSession |
| application | 应用程序对象，用于保存所有用户共享信息，同 ServletContext 对象 |
| page | 指当前页面转化后的 Servlet 类的实例，很少使用 |
| pageContext | JSP 的页面容器，当前 JSP 范围内有效 |
| exception | 表示 JSP 页面所发生的异常，在错误页面中才起作用 |

### OUT对象

*   **out 对象会将数据先插入到缓冲区中，只有调用response.getWriter()方法，将数据刷新到 response 的缓冲区 后再输出**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>out 对象</title>
</head>
<body>
    <%
        out.println("out 输出 1 <br/>");
        out.println("out 输出 2 <br/>");
        response.getWriter().write("response 输出 1 <br/>");
        response.getWriter().write("response 输出 2 <br/>");
    %>
</body>
</html>
```

（此处需结合幻灯片中的图片讲解：展示运行结果，response输出的内容显示在out输出的内容之前）

### 四大域对象

一共有 4 个常用的域对象，分别是 `pageContext`， `request`，`session`，`application` 对象。四个域对象功能一样，都用来存取数据，不同的是它们 对数据的存取范围。

**表 8-3 JSP 四大域对象**

| 域对象名称 | 类型 | 数据存取范围 |
| :--- | :--- | :--- |
| pageContext | PageContextImpl | 当前 JSP 范围内有效 |
| request | HttpServletRequest | 一次请求内有效 |
| session | HttpSession | 一个会话范围内有效（一次会话指打开浏览器访问服务器，直到关闭浏览器为止） |
| application | ServletContext | 整个 web 工程范围内有效(只要 web 工程不停止，数据都在) |

#### 代码示例

**DomainObjectServlet.java**

```java
@WebServlet(name = "DomainObjectServlet", urlPatterns = "/domainObject")
public class DomainObjectServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取 session 对象
        HttpSession session = request.getSession();
        // 获取 servletContext 对象即 JSP 中的 application 对象
        ServletContext servletContext = this.getServletContext();
        // 存数据
        request.setAttribute("reqKey", "保存在 request 对象中的数据");
        session.setAttribute("sessKey","保存在 session 对象中的数据");
        servletContext.setAttribute("appKey", "保存在 application 对象中的数据");
        // 请求转发
        request.getRequestDispatcher("domainObject1.jsp").forward(request, response);
    }
}
```

**domainObject1.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>域对象</title>
</head>
<body>
    <%
        pageContext.setAttribute("pageContextKey", "保存在 pageContext 对象中的数据");
    %>
    <%= pageContext.getAttribute("pageContextKey") %> <br>
    <%= request.getAttribute("reqKey") %> <br>
    <%= session.getAttribute("sessKey") %> <br>
    <%= application.getAttribute("appKey") %> <br>
    <a href="domainObject2.jsp">跳转到 domainObject2.jsp 页面</a> <br>
</body>
</html>
```

**domainObject2.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>域对象</title>
</head>
<body>
    <%= pageContext.getAttribute("pageContextKey") %> <br>
    <%= request.getAttribute("reqKey") %> <br>
    <%= session.getAttribute("sessKey") %> <br>
    <%= application.getAttribute("appKey") %> <br>
</body>
</html>
```

**结果**

（此处需结合幻灯片中的图片讲解：
图 8-11 domainObject1.jsp 显示结果：所有数据均正常显示。
图 8-12 domainObject2.jsp 显示结果：pageContext和request数据为null，session和application数据正常显示。
图 8-13 重启浏览器后访问 domainObject2.jsp 页面结果：只有application数据正常显示。）

### JSP 标签

*   **JSP 页面中可以嵌套一些 Java 代码来完成某种功能，但有时这种Java 代码会使得 JSP页面混乱，不利于调试和维护，为了解决这一问题，SUN 公司在 JSP 页面中嵌套一些标签，这些标签可以完成各种通用的 JSP 页面功能，本节将主要针对`<jsp:include>`和`<jsp:forward>`这两个 JSP 标签进行讲解**

#### `<JSP:INCLUDE>`标签

*   **`<jsp:include>`标签用于把另外一个资源的输出内容插入进当前页面的输出内容之中，这种在 JSP 页面执行时的引入方式称之为动态包含**

    `<jsp:include page=”relativeURL” flush=”true | false”>`

*   page 属性用于指定被引入资源的相对路径，flush 属性指定在插入 其他资源的输出内容时，是否先将当前 JSP 页面的已输出内容刷新到客户端

**dynInclude.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>包含页面</title>
</head>
<body>
    dynInclude.jsp 的内容
    <jsp:include page="beInclude.jsp" flush="true"></jsp:include>
</body>
</html>
```

**beInclude.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>被包含页面</title>
</head>
<body>
    <% Thread.sleep(2000); %>
    beInclude.jsp 中的内容
</body>
</html>
```

#### `<JSP:FORWARD>`标签

*   **在 JSP 页面中，有时需要将请求转发给另外一个资源，这时除了RequestDispatcher 接口的 forward()方法可以实现外，还可以通过`<jsp:forward>`标签来实现**

    `<jsp:forward page = “relativeURL”>`

**jspForward.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>jspForward 标签</title>
</head>
<body>
    <h4>跳转前内容</h4>
    <% Thread.sleep(2000);%>
    <jsp:forward page="jspForward2.jsp"></jsp:forward>
</body>
</html>
```

**jspForward2.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>jspForward 跳转后的页面</title>
</head>
<body>
    这是使用 jspforward 标签跳转后的页面。
</body>
</html>
```

启动 Tomcat 访问 jspForward.jsp 页面，浏览器并不会先显示“跳转前内容”，而是等待 了 2 秒后直接跳到了 jspForward.jsp 页

从上述结果可以看出，浏览器默认情况下是先解析完整个页面后再显示内容的，当解析到`<jsp:forward>`标签后直接跳转到了新页面

### JAVABEAN

*   **JavaBean是Java开发中一个可以重复使用的软件组件，具有如下规范**
    1.  必须有一个公共、无参构造方法
    2.  提供公共的getter和setter方法让外部程序设置和获取JavaBean的属性
*   **普通JavaBean也可以成为POJO, Entity…**

```java
public class Person {
    private int age;
    private String name;
    public Person(){}

    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

### JSP 开发模型

*   **为了更方便地使用 JSP 技术，SUN 公司为 JSP 技术提供了两种开发模型：JSP Model1 和 JSP Model2。JSP Model2 模型是在 JSP Model1 模型的基础上提出来的，它提供了更清晰地代码分层，分层的目的是为了解耦。解耦使得多人合作开发大型 Web 项目变得更加容易，并且方便项目后期的维护和升级。接下 来就针对这两种开发模型分别进行详细的介绍。**

#### JSP MODEL1

**工作原理如图**

（此处需结合幻灯片中的图片讲解：展示Model1流程图，客户端 -> 1.请求 -> JSP -> 2.调用 -> JavaBean -> 3.数据访问 -> 企业数据库 -> 4.响应）

**例 8.12：使用 Model1 完成用户登录功能**

**(1) 创建名的用户实体类 User.java，表示实体类数据**

```java
public class User {
    private String username;
    private String password;
    public User() {} // 无参构造方法
    // 根据需求添加有参构造方法
    // 省略 get(), set()方法
}
```

**(2) 创建 UserDao 类（业务逻辑类）让 JSP 层和JavaBean 之间能够交互。其中包括了 一个判断 User 对象的账号密码是否正确的方法 userLogin()**

**UserDAO.java**

```java
public class UserDao {
    public boolean userLogin(User user) {
        return "jason".equals(user.getUsername()) & 
               "123".equals(user.getPassword());
    }
}
```

**(3) 使用一个 login.jsp 界面来模拟登录**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登录界面</title>
</head>
<body>
<form action="doLogin.jsp" method="post">
    <table>
        <tr>
            <td>用户名：</td>
            <td><input type="text" name="username"></td>
        </tr>
        <tr>
            <td>密码：</td>
            <td><input type="password" name="password"></td>
        </tr>
        <tr>
            <td colspan="2"><input type="submit" value="提交"></td>
        </tr>
    </table>
</form>
</body>
</html>
```

**(4) 创建 doLogin.jsp 处理登录**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>处理登录请求</title>
</head>
<body>
    <jsp:useBean id="user" class="chap08.User" scope="page" />
    <jsp:useBean id="userDao" class="chap08.UserDao" scope="page" />
    <jsp:setProperty name="user" property="*" />
    <%
        if (userDao.userLogin(user)) {
            request.getRequestDispatcher("welcome.jsp").forward(request, response);
        } else {
            response.sendRedirect("login.jsp");
        }
    %>
</body>
</html>
```

**(5) 创建 welcome.jsp**

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>欢迎页面</title>
</head>
<body>
    <h2>登录成功，欢迎！</h2>
</body>
</html>
```

从上例中可以发现，尽管 Model1 的方式将一部分 Java 代码封装到JavaBean 里，但 JSP 页面仍然需要嵌入大量的 Java 代码，使得代码可读性差，维护困难。

（此处需结合幻灯片中的图片讲解：展示登录界面输入jason/...后的“登录成功，欢迎！”结果）

#### JSP MODEL2

*   **Servlet+JSP+JavaBean 的方式实现了流程控制、业务逻辑和页面显示的分离**

（此处需结合幻灯片中的图片讲解：展示Model2流程图，客户端 -> 请求 -> Servlet(控制层) -> Service层 -> Dao层 -> 数据库集群，以及各层与Entity层的交互，最后由Servlet转发请求到JSP视图层进行响应）

**例 8-13：使用 Model2 模拟实现用户登录**

*   **JSP Model2模型的思想，Web项目通常可以分成action层（控制器JavaBean），service 层（业务 JavaBean），dao 层（数据访问JavaBean）和 entity 层（简单 JavaBean）等基本层次结构**

**(1) dao 层中创建 UserDao 接口和UserDaoImpl 实现**

```java
public interface UserDao {
    public boolean userLogin(User user);
}
public class UserDaoImpl implements UserDao{
    @Override
    public boolean userLogin(User user) {
        return "jason".equals(user.getUsername()) &
               "123".equals(user.getPassword());
    }
}
```

**(2) 在 service 层中创建 UserService 接口 UserServiceImpl 实现**

```java
public interface UserService {
    public boolean login(User user);
}

public class UserServiceImpl implements UserService{
    private UserDao userDao = new UserDaoImpl();
    @Override
    public boolean login(User user) {
        return userDao.userLogin(user);
    }
}
```

**(3) 创建控制器 LoginServlet.java 来负责接收登录界面（login.jsp）提交的请求，并调 用 service 层的业务方法**

```java
@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {
    private UserService userService = new UserServiceImpl();
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        User user = new User();
        user.setPassword(password);
        user.setUsername(username);
        if (userService.login(user)) {
            request.getRequestDispatcher("welcome.jsp").forward(request, response);
        } else {
            response.sendRedirect("login.jsp");
        }
    }
}
```

（此处需结合幻灯片中的图片讲解：展示登录界面和登录成功欢迎界面）

### 总结

*   **角色：视图层（显示数据）**
*   **JSP表达式 （重点）**
*   **JSP指令和脚本片段 （会用）**
*   **JSP九大对象 （了解）**
*   **request属性范围（重点）**
*   **JSP MODEL（重点）**

## 第9章 基于数据库的WEB开发

### JDBC基础

#### JDBC相关概念介绍

*   Java为了简化、统一对数据库的操作，定义了一套Java操作数据库的规范（接口），称之为JDBC
*   这套接口由数据库厂商去实现，这样，开发人员只需要学习jdbc接口，并通过jdbc加载具体的驱动，就可以操作数据库。

数据库驱动实质上是不同数据库厂商对JDBC接口的实现，比如MySQL驱动用于连接MySQL 数据库，Oracle驱动用于连接Oracle 数据库，这体现了面向接口编程的思想

（此处需结合幻灯片中的图 9-1 JDBC 工作原理图进行讲解：展示应用程序通过JDBC标准接口，与具体的MySQL驱动或Oracle驱动交互，进而访问MySQL数据库或Oracle数据库的层次结构。）

#### 入门案例

编写 JDBC 程序读取 users 表的数据，并打印在控制台中

(1) 在 MySQL创建数据库、表并插入测试

```sql
create database jdbc;

use jdbc;

create table users(
    id int primary key auto_increment,
    username varchar(30),
    password varchar(30),
    email varchar(30)
)ENGINE = InnoDB CHARACTER SET = utf8;

insert into users(USERNAME, PASSWORD, EMAIL) values("小明","123","xm@wzu.edu.cn");
insert into users(USERNAME, PASSWORD, EMAIL) values("小红","234","xh@wzu.edu.cn");
insert into users(USERNAME, PASSWORD, EMAIL) values("小刚","345","xg@wzu.edu.cn");
insert into users(USERNAME, PASSWORD, EMAIL) values("小睿","456","xr@wzu.edu.cn");
```

（此处需结合幻灯片中的图 9-2 users 表数据图进行讲解：展示一个包含id, username, password, email列的表格数据。）

| id | username | password | email |
| :--- | :--- | :--- | :--- |
| 1 | 小明 | 123 | xm@wzu.edu.cn |
| 2 | 小红 | 234 | xh@wzu.edu.cn |
| 3 | 小刚 | 345 | xg@wzu.edu.cn |
| 4 | 小睿 | 456 | xr@wzu.edu.cn |

(2) 建立与数据库之间的访问连接

1) 首先需要使用 `Class.forName()` 方法加载数据库驱动，数据库驱动即为数据库厂商开发的针对 JDBC 接口的实现类。比如将 MySQL 公司实现 JDBC 接口的驱动包拷贝到项目工程的 lib 目录中 (WEB-INF/lib/)，本教程使用的驱动包为 mysql-connector-java-5.1.0-bin.jar

```java
Class.forName("com.mysql.jdbc.Driver");
```

2) 加载驱动程序之后，将使用 DriverManager 类的 `getConnection()` 方法建立与数据库的连接。此方法接受 3 个参数，分别表示数据库 URL、数据库用户名和密码

```java
Connection connection = DriverManager.getConnection(String url, String name, String password);
```

3) url 写法中 jdbc 部分是固定的，subprotocol 指定连接到特定数据库的驱动程序， subname 部分表示连接的服务器 IP 地址、端口、数据库名称以及参数等信息。

`jdbc:subprotocol:subname`

以 mysql 为例，

`jdbc:mysql://localhost:3306/jdbc?useUnicode=true&characterEncoding=UTF-8`

(3) 对编写好的 SQL 语句发送到数据库执行

首先通过 Connection 对象获取 Statement 对象，主要方式有两种，分别是通过调用 `createStatement()` 方法创建基本的 Statement 对象和通过调用 `prepareStatement()` 方法创建预编译的 PreparedStatement 对象

```java
Statement stmt = connection.createStatement();
```

有了 Statement 对象后，便可以使用它来执行 SQL 语句。所有的 Statement 都有三种方法来执行 SQL 语句

| 方法名称 | 功能描述 |
| :--- | :--- |
| execute(String sql) | 用于执行各种 SQL 语句，该方法返回一个 boolean 类型的值，如果为 true，表示所执行的 SQL 语句具备查询结果。 |
| executeQuery(String sql) | 用于执行 SQL 中的 select 语句，该方法返回一个表示查询结果的 ResultSet 对象 |
| executeUpdate(String sql) | 用于执行 SQL 中的 insert、update 和 delete 语句。该方法返回一个 int 类型的值，表示数据库中受该 SQL 语句影响的记录的数据。 |

以 executeQuery()方法为例，具体代码如下

```java
String sql = "select * from users";
ResultSet rs = stmt.executeQuery(sql);
```

(4) 对数据库返回的结果进行处理

```java
while (rs.next()){
    int id = rs.getInt("id");
    String username = rs.getString("username");
    String password = rs.getString("password");
    String email = rs.getString("email");
    System.out.println(id + "--" + username + "--" + password + "--" + email);
}
```

上述代码首先调用 ResultSet 对象的 `next()` 将记录指针向下移动一行（默认指向表的标题行），判断是否存在查询结果数据；如果存在，则根据列的名称以及数据类型调用不同的 `getXxx()` 方法获取数据并赋值，最终将每一行数据打印到控制台中

(5) 回收数据库资源

使用 `close()` 方法关闭数据库连接，释放资源，包括关闭 ResultSet 对象、Statement 对象和 Connection 对象。释放资源应按照创建的顺序逐一释放，先创建的后释放、后创建的先释放。

```java
rs.close();
stmt.close();
connection.close();
```

完整的代码如 JDBCDemo1.java

```java
public class JDBCDemo1 {
    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            Connection connection=DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc","root", "root");
            Statement stmt = connection.createStatement();
            String sql = "select * from users";
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()){
                int id = rs.getInt("id");
                String username = rs.getString("username");
                String password = rs.getString("password");
                String email = rs.getString("email");
                System.out.println(id + "--" + username + "--" + password + "--" + email);
            }
            rs.close();
            stmt.close();
            connection.close();
        }
    }
}
```

（此处需结合幻灯片中的图 9-3 控制台打印 users 表数据图进行讲解：展示程序运行后在控制台输出的四行用户信息。）

#### 优化

*   将MySQL数据库的连接信息配置在db.properties中

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/jdbc?useUnicode=true&characterEncoding=UTF-8
username=root
password=root
```

*   创建 JDBCUtils.java
    *   该类主要用于读取配置文件、加载驱动获取数据库连接、封装关闭数据库资源等操作
    *   代码中静态代码块在加载 JDBCUtils 类的时候执行并且只执行一次，以保证获取数据库连接的效率

*   使用 PreparedStatement 代替 Statement
    *   (1) 代码的可读性和可维护性

```java
Statement stmt = conn.createStatement();
String sql = "insert into users (username, password, email) values ('"+username+"','"+password+"','"+email+"')";
stmt.executeUpdate(sql);
```

可使用 PreparedStatement 对象修改上述代码，具体如下。

```java
String sql1 = "insert into users(username, password, email) values(?, ?, ?)";
PreparedStatement pstmt = conn.prepareStatement(sql1); // 占位符
pstmt.setString(1, username);
pstmt.setString(2, password);
pstmt.setString(3, email);
pstmt.executeUpdate(sql1);
```

PreparedStatement 接口继承自 Statement 接口，PreparedStatement 实例包含已编译的 SQL 语句，SQL 语句可具有一个或多个输入参数。这些输入参数的值在 SQL 语句创建时未被指定，而是为每个输入参数保留一个问号“?”作为占位符

*   (2) 提高性能
    由于 SQL 语句有可能被重复调用，而使用 PreparedStatement 对象声明的 SQL 语句在被数据库编译后的执行代码会缓存下来，因此下次调用时不需要重新编译，只要将参数直接传入编译过的语句执行代码中（相当于一个函数）即可，从而提高了性能

*   (3) 极大地提高了安全性
    使用statement, 在 WEB 环境下会容易受到“SQL 注入”攻击，导致整个应用程序不安全

```sql
select * from users where username='"+name+"' and password='"+passwd+"'";
```

如果前端用户把 ‘jason’ 作为 username 的值，[‘or’‘1’=‘1’]作为 passwd 的值传进来，则后端执行的 SQL 语句变为

```sql
select * from users where username = 'jason' and passwd = '' or '1'='1'
```

因为'1'='1'肯定成立，因此前端用户可以不使用任何密码通过验证。

#### 例 9.2 查询用户名中有“小”字的所有用户信息

```java
public class JDBCOptimize {
    public static void main(String[] args) throws SQLException {
        Connection conn = JDBCUtils.getConnection(); //获取连接
        String sql = "select * from users where username like ?";
        PreparedStatement pstmt = conn.prepareStatement(sql); // 预编译 SQL
        String str = "小";
        pstmt.setString(1, "%" + str + "%"); //处理参数
        ResultSet rs = pstmt.executeQuery(); //执行查询并返回结果集
        //处理结果集
        while (rs.next()){
            int id = rs.getInt("id");
            String username = rs.getString("username");
            String password = rs.getString("password");
            String email = rs.getString("email");
            System.out.println(id + "--" + username + "--" + password + "--" + email);
        }
        //释放资源
        JDBCUtils.release(conn, pstmt, rs);
    }
}
```

### 基于JDBC的WEB开发

*   本节将结合上一章内容中介绍的 MVC 模型讲解在 Web 开发中常见的 CRUD 操作（业务数据的增、删、改、查），分页查询以及数据库连接池的使用

（此处需结合幻灯片中的图 9-4 web 应用层次结构图进行讲解：展示了一个典型的Web项目结构，包含action, dao, entity, service, utils, web等包。）

#### 例 9.3: JSP 页面中显示所有用户的信息

(1) 准备相关工具类和实体类, 将 JDBCUtils.java 类放到 utils 包下，在 entitiy 层创建实体类

```java
public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    // 省略构造方法、get()， set()， toString()方法
    ...
}
```

(2) dao 层创建对应实体类的数据访问接口和实现类

（此处需结合幻灯片中的项目结构图进行讲解：展示在dao包下创建user子包，并包含UserDao接口和UserDaoImpl实现类。）

UserDao.java

```java
public interface UserDao {
    List<User> findUsers();
}
```

UserDaoImpl.java

```java
public class UserDaoImpl implements UserDao{
    @Override
    public List<User> findUsers() {
        List<User> users = new ArrayList<User>();
        Connection conn = JDBCUtils.getConnection();
        String sql = "select * from users";
        PreparedStatement pstmt = null;
        try {
            pstmt = conn.prepareStatement(sql);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                User user = new User(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4));
                users.add(user);
            }
            JDBCUtils.release(conn, pstmt, rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }
}
```

(3) service 层创建对应用户业务接口及其实现类

UserService.java

```java
public interface UserService {
    List<User> findAllUsers();
}
```

UserServiceImpl.java

```java
public class UserServiceImpl implements UserService{
    private UserDao userDao = new UserDaoImpl(); // 与dao层关联
    @Override
    public List<User> findAllUsers() {
        return userDao.findUsers(); //调用 dao 层的操作
    }
}
```

(4) 在 action 层创建接受请求的 servlet 控制器

UserFindAllServlet.java

```java
@WebServlet(name = "UserFindAllServlet", urlPatterns = "/findAllUsers")
public class UserFindAllServlet extends HttpServlet {
    //关联 service 层
    private UserService userService = new UserServiceImpl();
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<User> users = userService.findAllUsers();
        //将数据库获取的数据保存到 request 范围内
        request.setAttribute("users", users);
        //转发到目标页面,使得数据信息能在前端页面显示
        request.getRequestDispatcher("users.jsp").forward(request, response);
    }
}
```

(5) 在 web 根目录下创建前端 JSP 页面展示模型数据信息

```html
<body>
<%
    //获取后台用户数据
    List<User> users = (ArrayList)(request.getAttribute("users"));
%>
<div><a href="addUser.jsp">新增用户</a></div>
<table border="1">
    <tr>
        <td>ID</td><td>用户名</td><td>密码</td><td>邮箱</td><td>操作</td>
    </tr>
    <%
        for(int i=0; i<users.size(); i++) {
            User user = users.get(i);
    %>
    <tr>
        <td><%= user.getId() %></td>
        <td><%= user.getUsername() %></td>
        <td><%= user.getPassword() %></td>
        <td><%= user.getEmail() %></td>
        <td><a href="updateUser.jsp">更新</a> <a href="">删除</a></td>
    </tr>
    <%
        }
    %>
</table>
</body>
```

（此处需结合幻灯片中的图 9-6 显示所有用户信息图进行讲解：展示了在网页上以表格形式列出所有用户数据，并包含新增、更新、删除等操作链接。）

#### 例 9.4: 新增用户

addUser.jsp

```html
<body>
    <h2>新增用户</h2>
    <form action="/addUser" method="post">
        输入用户名: <input type="text" name="username" /> <br/>
        输入密码: <input type="password" name="password" /> <br/>
        输入邮箱:<input type="text" name="email" /> <br/>
        <input type="submit" value="新增">
    </form>
</body>
```

（此处需结合幻灯片中的图 9-7 新增用户界面图进行讲解：展示一个包含用户名、密码、邮箱输入框和新增按钮的表单。）

UserAddServlet.java

```java
@WebServlet(name = "UserAddServlet", urlPatterns = "/addUser")
public class UserAddServlet extends HttpServlet {
    private UserService userService = new UserServiceImpl();
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        //获取用户请求数据
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String email = request.getParameter("email");
        User user = new User(0, username, password, email);
        userService.addUser(user);
        response.sendRedirect("addUserSuc.jsp");
    }
}
```

service 层只需要添加并实现相应的业务方法 addUser()即可

dao 层操作

UserDao.java

```java
public interface UserDao {
    //省略其他方法
    void insert(User user);
}
```

UserDaoImpl.java

```java
public class UserDaoImpl implements UserDao{
    //省略其他方法
    public void insert(User user) {
        Connection conn = JDBCUtils.getConnection();
        String sql = "insert into users(username, password, email) values(?, ?, ?)";
        PreparedStatement pstmt = null;
        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getEmail());
            pstmt.executeUpdate();
            JDBCUtils.release(conn, pstmt, null);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### 例 9.5: 更新用户

1) 首先在 users.jsp 中的“操作”超链接中指定 href 属

`<a href="/findUserById?id=<%= user.getId()%>">更新</a>`

2) UserFindByIdServlet.java 来映射URL请求

```java
@WebServlet(name = "UserFindByIdServlet", urlPatterns = "/findUserById")
public class UserFindByIdServlet extends HttpServlet {
    private UserService userService = new UserServiceImpl();
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取当前用户的id值
        int id = Integer.parseInt(request.getParameter("id"));
        User user = userService.findUserById(id);
        request.setAttribute("user", user);
        request.getRequestDispatcher("updateUser.jsp").forward(request, response);
    }
}
```

UserDaoImpl.java

```java
public class UserDaoImpl implements UserDao{
    //省略其他方法
    public User findUserById(int id) {
        Connection conn = JDBCUtils.getConnection(); //获取连接
        String sql = "select * from users where id = ?"; //准备 SQL 语句
        PreparedStatement pstmt = null;
        User user = null;
        try {
            pstmt = conn.prepareStatement(sql); // 预编译 SQL
            pstmt.setInt(1, id); //根据ID 设置参数
            ResultSet rs = pstmt.executeQuery(); //执行查询
            if (rs.next()){ //如果该用户存在,则获取字段并封装成对象
                user = new User(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4));
            }
            JDBCUtils.release(conn, pstmt, rs); //释放资源
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user; //返回 User 对象
    }
}
```

成功获取用户数据后, UserFindByIdServlet 将当前用户保存到 request 域对象中并转发到 updateUser.jsp,

```html
<body>
<%
    User user = (User)(request.getAttribute("user"));
%>
<h2>更新用户</h2>
<form action="/updateUser" method="post">
    <input type="hidden" name="id" value="<%= user.getId()%>" />
    输入用户名: <input type="text" name="username" value="<%= user.getUsername()%>" /> <br/>
    输入密码: <input type="password" name="password" value="<%= user.getPassword()%>" /> <br/>
    输入邮箱:<input type="text" name="email" value="<%= user.getEmail()%>" /> <br/>
    <input type="submit" value="更新">
</form>
</body>
```

（此处需结合幻灯片中的更新用户界面图进行讲解：展示一个预先填充了用户信息的表单，供用户修改。）

UserUpdateServlet.java

```java
@WebServlet(name = "UserUpdateServlet", urlPatterns = "/updateUser")
public class UserUpdateServlet extends HttpServlet {
    private UserService userService = new UserServiceImpl();
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        int id = Integer.parseInt(request.getParameter("id"));
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String email = request.getParameter("email");
        User user = new User(id, username, password, email);
        userService.updateUser(user);
        response.sendRedirect("updateUserSuc.jsp");
    }
}
```

更新成功后，跳转到更新成功页面

UserDaoImpl.java

```java
public class UserDaoImpl implements UserDao{
    //省略其他方法
    public void updateUser(User user) {
        Connection conn = JDBCUtils.getConnection();
        String sql = "update users set username = ?, password = ?, email = ? where id = ?";
        PreparedStatement pstmt = null;
        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getEmail());
            pstmt.setInt(4, user.getId());
            pstmt.executeUpdate();
            JDBCUtils.release(conn, pstmt, null);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### 例 9.6: 删除用户

首先在 users.jsp 中的“删除”超链接中指定 href 属性，如

`<a href="javascript:deleteUser('<%= user.getId()%>')">删除</a>`

当“删除”超链接被点击后会执行 JavaScript 函数：deleteUser(id)，并将当前用户的 id 值作为参数传入，具体如

```javascript
<script>
    function deleteUser(id) {
        if (confirm("确定要删除嘛?")) {
            location.href = "/userDelete?id=" + id;
        }
    }
</script>
```

（此处需结合幻灯片中的删除确认弹窗图进行讲解。）

用户单击“确定”按钮后，页面会向 URL 路径为“/userDelete”的 servlet 发送请求，并将当前用户的 id 属性值作为请求参数传过去。

UserDeleteByIdServlet.java

```java
@WebServlet(name = "UserDeleteByIdServlet", urlPatterns = "/userDelete")
public class UserDeleteByIdServlet extends HttpServlet {
    private UserService userService = new UserServiceImpl();
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        userService.deleteUserById(id);
        response.sendRedirect("delUserSuc.jsp");
    }
}
```

UserDaoImpl.java

```java
public class UserDaoImpl implements UserDao{
    //省略其他方法
    public void deleteUserById(int id) {
        Connection conn = JDBCUtils.getConnection();
        String sql = "delete from users where id = ?";
        PreparedStatement pstmt = null;
        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
            JDBCUtils.release(conn, pstmt, null);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### 分页查询

基于 mysql 数据库进行分页查询与 oracle 数据库相比要简单的多，其基本思想是根据起始行号和行数获取相应的数据，SQL 语句语法如下所示

`select * from tb_name limit beginIndex, totalRows;`

tb_name 表示表的名称，beginIndex 表示起始行号（从 0 开始），totalRows 表示获取数据的行数

例如，假设 users 表中总共有 100 行数据，每一页显示 10 行，则一共可分成 10 页数据。第 1 页的数据可以从第 0 行开始取（beginIndex=0），共取 10 行（totalRows=10）第 2 页的数据可以从第 10 行开始取（beginIndex=10），共取 10 行（totalRows=10），以此类推。因此，可以使用根据根据当前页码（pageNow）和每页显示数据的行数（pageCount），来确定分页查询的 SQL 语句，

`select * from tb_name limit (pageNow-1)*pageCount, pageCount;`

#### 例 9.7: 分页显示所有用户信息

（此处需结合幻灯片中的分页显示用户信息图进行讲解：展示一个带有分页导航（共...条记录，上一页，下一页）的用户列表。）

(1) 使用 PreparedStatement 批处理添加数据

```java
public class JDBCBatch {
    public static void main(String[] args) throws SQLException {
        Connection conn = JDBCUtils.getConnection();
        String sql = "insert into users(username, password, email) values(?, ?, ?)";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        for (int i = 0; i < 100; i++) {
            pstmt.setString(1, "name" + i);
            pstmt.setString(2, "pwd" + i);
            pstmt.setString(3, "email" + i + "@163.com");
            pstmt.addBatch(); //添加成批
        }
        pstmt.executeBatch(); //批处理
        JDBCUtils.release(conn, pstmt, null);
    }
}
```

(2) dao 层中添加分页查询方法及其实现

```java
public interface UserDao {
    //省略其他方法
    List<User> findAllUsersPageable(int pageNow, int pageCount);
    int getTotalRows();
}
```

```java
//获取分页数据
public List<User> findAllUsersPageable(int pageNow, int pageCount) {
    List<User> users = new ArrayList<User>();
    Connection conn = JDBCUtils.getConnection();
    String sql = "select * from users limit ?, ?"; //分页查询 SQL
    // ... try-catch block to execute query and populate users list
    pstmt.setInt(1, (pageNow-1)*pageCount); //设定分页参数
    pstmt.setInt(2, pageCount);
    // ...
    return users;
}

//获取总记录数
public int getTotalRows() {
    Connection conn = JDBCUtils.getConnection();
    String sql = "select count(*) from users";
    // ... try-catch block to execute query and return count
    return count;
}
```

(3) 创建 UserFindAllPageableServlet 分页查询所有用户信息

```java
@WebServlet(name = "UserFindAllPagableServlet", urlPatterns = "/findUserPageable")
public class UserFindAllPageableServlet extends HttpServlet {
    private UserService userService = new UserServiceImpl();
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pageInfo = request.getParameter("pageNow");
        if (pageInfo == null) { //默认当前页为1
            pageInfo = "1";
        }
        int pageNow = Integer.parseInt(pageInfo); //当前页
        int pageCount = 10; //每页显示记录数
        int totolRows = userService.getTotalUserCount(); //获取总记录数
        //计算总页数
        int totalPages = (totolRows % pageCount == 0) ? (totolRows / pageCount) : (totolRows / pageCount + 1);
        //处理页面异常
        if (pageNow < 1) { pageNow = 1; }
        if (pageNow > totalPages) { pageNow = totalPages; }
        // 封装成 Page对象,方便前端读取
        Page page = new Page(pageNow, pageCount, totalPages, totolRows);
        //获取分页数据
        List<User> users = userService.findAllUsersPageable(pageNow, pageCount);
        //保存模型信息,模型包括用户数据和页面对象数据
        request.setAttribute("users", users);
        request.setAttribute("page", page);
        request.getRequestDispatcher("usersPage.jsp").forward(request, response);
    }
}
```

Page.java

```java
public class Page {
    private int pageNow;
    private int pageCount;
    private int totalPage;
    private int totalRows;
    //省略构造方法和 get()、set()方法
}
```

userPage.jsp

```html
<%
    //获取分页数据
    List<User> users = (ArrayList)(request.getAttribute("users"));
    Page p = (Page)(request.getAttribute("page")); //获取页面对象
%>
...
<table border="1">
    ... // 与 users.jsp 相同
</table>
共<%= p.getTotalRows()%>条记录, <%=p.getPageNow()%>/<%=p.getTotalPage()%>
<a href="/findUserPageable?pageNow=<%= p.getPageNow() - 1 %>">上一页</a>
<a href="/findUserPageable?pageNow=<%= p.getPageNow() + 1 %>">下一页</a>
...
</body>
```

### 数据库连接池

*   应用程序直接获取数据库连接的缺点
    用户每次请求都需要向数据库获得链接，而数据库创建连接通常需要消耗相对较大的资源，创建时间也较长。假设网站一天10万访问量，数据库服务器就需要创建10万次连接，极大的浪费数据库的资源，并且极易造成数据库服务器内存溢出、宕机。

*   使用数据库连接池优化程序性能
    数据库连接池在初始化时将创建一定数量的数据库连接放到连接池中，

*   数量如何设置？
    *   最小连接数：是连接池一直保持的数据库连接
        *   当请求数超过最小连接数时，会创建新连接。
    *   最大连接数：是连接池能申请的最大连接数
        *   当请求数超过最大连接数时，请求排队等待。

（此处需结合幻灯片中的连接池工作原理图进行讲解：展示用户程序从连接池获取连接、使用后归还连接的流程。）

#### Druid 连接池

Druid 为阿里巴巴的数据源（数据库连接池），它不仅集成了 c3p0、dbcp、proxool 等连接池的优点，还加入了日志监控机制，能有效的监控数据库连接池和 SQL 的执行情况。Druid 的 DataSource 实现类为 com.alibaba.druid.pool.DruidDataSource

| 配置 | 说明 |
| :--- | :--- |
| url | 连接数据库的 url，不同的数据库不一样 |
| username | 连接数据库的用户名 |
| password | 连接数据库的密码 |
| driverClassName | 如不配置该参数，druid 会根据 url 自动识别数据库驱动，建议配置 |
| initialSize | 初始化时建立物理连接的个数 |
| maxActive | 最大活动连接数量 |
| minIdle | 最小连接数 |
| filters | 内置过滤器若不配置则不会统计 SQL 执行 |

在 src 目录下创建 dbpool.properties

```properties
driverClassName=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/jdbc?useUnicode=true&characterEncoding=UTF-8
username=root
password=root
initialSize=10
maxActive=10
minIdle=10
filters=stat
```

DruidUtil 工具类来读取配置信息并获取 Connection 对象

```java
public class DruidUtil {
    static DruidDataSource dataSource;
    static {
        Properties prop = new Properties();
        try {
            prop.load(DruidUtil.class.getClassLoader().getResourceAsStream("dbpool.properties"));
            dataSource = (DruidDataSource) DruidDataSourceFactory.createDataSource(prop);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

要在 Web 端监控数据库及 SQL 执行情况，只需要在 web.xml 文件中配置相关的 servlet 即可

```xml
<servlet>
    <servlet-name>StatViewServlet</servlet-name>
    <servlet-class>com.alibaba.druid.support.http.StatViewServlet</servlet-class>
    <init-param>
        <!-- 允许清空统计数据 -->
        <param-name>resetEnable</param-name>
        <param-value>true</param-value>
    </init-param>
    <init-param>
        <!-- 用户名 -->
        <param-name>loginUsername</param-name>
        <param-value>admin</param-value>
    </init-param>
    <init-param>
        <!-- 密码 -->
        <param-name>loginPassword</param-name>
        <param-value>admin</param-value>
    </init-param>
</servlet>
<servlet-mapping>
    <servlet-name>StatViewServlet</servlet-name>
    <url-pattern>/druid/*</url-pattern>
</servlet-mapping>
```

启动服务器，在浏览器地址栏输入 URL 地址 http://localhost:8080/druid

（此处需结合幻灯片中的图 9-13 druid 主界面图进行讲解：展示了Druid监控平台的登录界面和登录后的主监控界面。）

### JDBC中使用事务

*   当 Jdbc 程序向数据库获得一个 Connection 对象时，默认情况下这个 Connection 对象会自动向数据库提交在它上面发送的 SQL 语句。
*   若想关闭这种默认提交方式，让多条 SQL 在一个事务中执行，可使用下列的 JDBC 控制事务语句
    *   `Connection.setAutoCommit(false);` //开启事务(start transaction)
    *   `Connection.rollback();` //回滚事务(rollback)
    *   `Connection.commit();` //提交事务(commit)

### 总结

*   JDBC的应用
*   Web开发的架构设计
    *   分层思想
*   前端后端交互的本质
    *   数据的交互
    *   前端发数据，后端处理后显示数据。

## 第10章 会话技术基础

#### 会话概念

*   **会话可简单理解为：** 用户开一个浏览器，点击多个超链接，访问服务器多个web资源，然后关闭浏览器，整个过程称之为一个会话。
*   **会话过程中，会产生一些数据**
*   **如何保存这些数据，为用户服务，如购物车数据。**
*   **HttpServletRequest 对象中和 ServletContext 对象都可以对数据进行保存，但在购物车这一问题上，都不能解决**
    *   用户每次发送 HTTP 请求，Web 服务器都会创建一个 HttpServletRequest 对象，该 对象只能保存本次请求所传递的数据
    *   ServletContext 对象的作用域是整个 Web 应用，因此，多个用户会共享某个特定的 ServletContext 对象。这样一来会导致多个不同的用户共享同一辆购物车
*   **在 Servlet 技术中，提供了两个用于保存会话数据的 对象，分别是 Cookie 和 Session**

### COOKIE

#### 概述

*   **Cookie是客户端技术，** 程序把每个用户的数据以cookie的形式写给用户各自的浏览器。当用户使用浏览器再去访问服务器中的web资源时，就会带着各自的数据去。

（此处需结合幻灯片中的图片讲解：展示客户端与服务器的交互流程。1. 请求，发送Name和Password；2. 响应，cookie: Name/Password；3. 临时性/永久性存储；4. 再次请求，自动携带cookie信息。）

#### 详细步骤

1.  浏览器首先通过用户名和密码请求登录到服务器
2.  服务器获取到用户名、密码并以 Cookie 的形式写回到了客户端
3.  客户端可以零时性的将 Cookie 保存在浏览器缓存中，也可以永久性的以文件的形 式保存在硬盘里
4.  后续访问服务器时，可自动携带 cookie 信息
5.  根据自动携带的 Cookie 信息，服务器可以获取跟当前站点相关的用户名、密码信 息自动填入输入框，而不需用户重新输入。

#### 案例

*   **记住用户名密码（成功登录网站后）**
*   **思路：**
    *   用户登陆成功后，服务端生成cookie对象（保存了用户名密码），写到客户端。
    *   下次访问服务端时，会遍历客户端的所有cookie对象，根据上回写如的key信息，找到value值，并设置到相应的input中。

*   **常用API**

| public Cookie(String name, String value) | Cookie 的构造方法，参数 name 用于指定 Cookie 的名称，value 用于指定 Cookie 的值，类似一种 map 结构 |
| :--- | :--- |
| String getValue() | 用于获取 Cookie 的值 |
| String getName() | 用于获取 Cookie 的名称 |
| void setValue(String newValue) | 用于设置 Cookie 的值 |
| void setMaxAge(int expiry) | 用于设置 cookie 在浏览器上保持有效的秒数 |
| void setPath(String uri) | 用于设置 cookie 的有效路径 |

#### 例：登录界面免输入用户名和密码

**1）新建Web 工程后，修改项目名称为“/chap10”**

**2）login.jsp：在页面中直接获取cookie对象，初始为空**

```html
<body>
<%
    String username="";
    String password="";
    Cookie[] cookies=request.getCookies(); //获取客户端自动发送的所有 Cookie 对象
    if(cookies!=null && cookies.length>0){
        for(int i=0;i<cookies.length;i++) { // 循环遍历所有 Cookie 对象
            // 获取名字为username 的 Cookie 的值
            if("username".equals(cookies[i].getName())){
                username=cookies[i].getValue();
            // 获取名字为password 的 Cookie 的值
            }else if("password".equals(cookies[i].getName())){
                password=cookies[i].getValue();
            }
        }
    }
%>
```

**3）利用 servlet 向客户端写入 cookie**

```java
@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        //模拟登录
        if ("jason".equals(username) && "123".equals(password)) {
            //成功，则创建 Cookie 对象
            Cookie uCookie = new Cookie("username", username);
            Cookie pCookie = new Cookie("password", password);
            // 设置 Cookie 有效时间为1个月，此后失效
            uCookie.setMaxAge(60*60*24*30);
            pCookie.setMaxAge(60*60*24*30);
            /** 设置 cookie 路径（服务器根目录），本项目中只有 URL 包含“/chap10”的请求才会自动发送
            以下 Cookie 对象*/
            uCookie.setPath(request.getContextPath());
            pCookie.setPath(request.getContextPath());
            // 写入客户端
            response.addCookie(uCookie);
            response.addCookie(pCookie);
            request.getRequestDispatcher("welcome.jsp").forward(request,response);
        }else {
            response.sendRedirect("login.jsp");
        }
    }
}
```

**4）再次访问login.jsp页面，观察 cookie 信息**

（此处需结合幻灯片中的图片讲解：展示浏览器开发者工具（Application -> Cookies）中查看到的 cookie 信息，包含 username 和 password。）

### SESSION

#### SESSION概述

*   **与 Cookie 技术不同的是，Session 技术是一种将会话数据保存到服务端的技术**
*   **用户第一次访问服务器的时候自动创建，直到关闭浏览器时销毁，这期间用户与服务器之 间的所有请求和响应都共享一个 Session**

（此处需结合幻灯片中的图片讲解：展示Session的工作原理图。1.A请求servlet1 -> 2.为A创建session, 并分配ID -> 3.B请求servlet1 -> 4.为B创建session, 并分配ID -> 5.响应：SessionID以cookie的形式式各自写回客户端 -> 6.A请求servlet2, 携带Cookie对象:JSESSIONID=110 -> 7.为A查找到ID为110的session对象 -> 8.B请求servlet2 -> 9.为B查找到ID为119的session对象。）

#### 对比COOKIE

*   **存放位置不同：** cookie 数据存放在客户端（浏览器）；session 数据一般存放在服务 器端的内存中，但是 SessionID 存储在客户端 cookie
*   **cookie 由浏览器存储在本地，安全有风险，不宜存储敏感信息，如账号密码等。**
*   **session 会在一定时间内保存在服务器上，访问较多时，影响服务器性能**

#### 案例

*   **Session 的常用 API 方法**
*   Session 是 与每个请求消息紧密相关的，为此，HttpServletRequest 类中定义了用于获取 Session 对象的 API

    `public HttpSession getSession()`

**表 10-2 HttpSession 常用 API**

| 方法声明 | 功能描述 |
| :--- | :--- |
| String getId() | 用于返回与当前 HttpSession 对象关联的会话 ID |
| void setAttribute(String name, Object value) | 用于将一个对象与一个名称关联后存储到当前 HttpSession 对象中 |
| String getAttribute() | 用于从当前 HttpSession 对象中返回指定名称的属性对象 |
| void removeAttribute() | 用于从当前 HttpSession 对象中删除指定名称的属性 |
| void setMaxInactiveInterval(int interval) | 用于设置当前 HttpSession 对象超时时间间隔时间 |
| boolean isNew() | 判断当前 HttpSession 对象是否是新创建的 |

#### 例10-1 实现添加产品到购物车、查看购物车等功能

**实现思路：** 首先获取商品列表数据并显示到页面上，用户可以发送多次请求将所需要的商品添加到购物车中，可以用一个 Map 结构来封装购物车对象，并添加相应的 API 实现 购物车的添加产品功能。查看购物车时显示所有已添加的产品，这里需要用 Session 对象来存取会话范围内的数据

**（1）准备测试数据：在 dao 层创建 EProductDB类**

```java
public class EProductDB {
    private static Map<String,EProduct> productsMap = new HashMap<>();
    static {
        //模拟数据
        EProduct p1 = new EProduct("1001", "CHERRY 键盘", 698.0f, 100, 1);
        EProduct p2 = new EProduct("1002", "MAC 电脑", 13998.0f, 500, 1);
        EProduct p3 = new EProduct("1003", "SIEMENS 洗衣机", 9900.0f, 200, 1);
        EProduct p4 = new EProduct("1004", "GREE 空调", 5500.0f, 80, 1);
        EProduct p5 = new EProduct("1005", "HUAWEI 手机", 3800.0f, 300, 1);
        EProduct p6 = new EProduct("1006", "DELL 服务器", 50000.0f, 200, 1);
        //2.将商品放到 map 集合中
        productsMap.put(p1.getPid(), p1);
        productsMap.put(p2.getPid(), p2);
        productsMap.put(p3.getPid(), p3);
        productsMap.put(p4.getPid(), p4);
        productsMap.put(p5.getPid(), p5);
        productsMap.put(p6.getPid(), p6);
    }
    // 获取所有产品集合
    public static Collection<EProduct> getEProducts() {
        return productsMap.values();
    }
    // 对外提供2方法
    // 根据产品 ID 获取产品
    public static EProduct getEProduct(String id) {
        return productsMap.get(id);
    }
}
```

**（2）将测试数据显示到 list.jsp 页面，具体如下**

```html
<table border="1">
    <tr>
        <td>商品 id</td><td>商品名称</td><td>商品单价</td><td>商品库存</td><td>是否购买</td>
    </tr>
    <%
        // 获取测试数据
        Collection<EProduct> products = EProductDB.getEProducts();
        // 在表格中循环显示各个测试数据
        for (EProduct p : products) {
    %>
        <tr>
            <td><%= p.getPid() %></td>
            <td><%= p.getPname() %></td>
            <td><%= p.getPrice() %></td>
            <td><%= p.getQuantity() %></td>
            <td>
                <a href="<%= request.getContextPath() %>/cartAdd?pid=<%= p.getPid() %>">加入购物车</a>
            </td>
        </tr>
    <%
        }
    %>
</table>
```

（此处需结合幻灯片中的图片讲解：展示商品列表页面的表格效果，包含商品ID、名称、单价、库存和加入购物车的链接。）

**（3）创建购物车容器类 Car，该类用于封装购物车的基本功能**

```java
public class Cart {
    // 底层为 map 结构
    private Map<String,EProduct> maps;
    public Cart() {
        maps=new HashMap<>();
    }

    // 添加产品到购物车
    public void add(EProduct p){
        if (maps.get(p.getPid()) == null) {
            maps.put(p.getPid(), p);
        }else {
            EProduct product = maps.get(p.getPid());
            product.setpNums(product.getpNums() + 1); // 购买数量加 1
            maps.put(p.getPid(), product);
        }
    }
    
    public Map<String, EProduct> getMaps() {
        return maps;
    }
    
    public void setMaps(Map<String, EProduct> maps) {
        this.maps = maps;
    }
}
```

**（4）在图 9-5 中点击“加入购物车”超链接，会发送请求到以“/cartAdd”为 URL 路 径的 Servlet 处理**

```java
@WebServlet(name = "CartAddServlet", urlPatterns = "/cartAdd")
public class CartAddServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pid = request.getParameter("pid");
        EProduct product = EProductDB.getEProduct(pid);
        
        // 获取 HttpSession 对象
        HttpSession session = request.getSession();
        // 获取购物车对象
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart == null) {
            cart = new Cart(); //如果 cart 为 null 表示首次使用，需创建
        }
        cart.add(product); //添加对应产品到购物车
        session.setAttribute("cart", cart);
        response.sendRedirect("addSuc.jsp");
    }
}
```

**（5）创建 cartShow.jsp 页面，显示购购物车数据**

```html
<body>
<%
    Cart cart = (Cart)(session.getAttribute("cart"));
    if (cart == null) {
%>
    <h2>购物车为空，请<a href="list.jsp">返回</a>添加商品</h2>
<%
    } else {
        //获取所有产品
        Collection<EProduct> products = cart.getMaps().values();
%>
<table border="1">
    <tr>
        <td>商品 id</td><td>商品名称</td><td>商品单价</td><td>购买数量</td>
    </tr>
<%
        for (EProduct p : products) {
%>
    <tr>
        <td><%= p.getPid() %></td>
        <td><%= p.getPname() %></td>
        <td><%= p.getPrice() %></td>
        <td><%= p.getpNums() %></td>
    </tr>
<%
        }
    }
%>
</table>
</body>
```

（此处需结合幻灯片中的图片讲解：
1.  展示“购物车为空，请返回添加商品”的页面效果。
2.  展示购物车有商品时的表格效果，显示商品ID、名称、单价和购买数量。）

#### 例10-2：使用 session 对象实现用户登录、注销和内部页面的访问功能

**实现思路：** 用户使用正确的用户名（假设为 jason）、密码登录成功后，请求重定向到欢 迎页面 welcome.jsp，欢迎页面能够显示该用户的用户名信息。由于上述过程客户端发送了多次请求，不能使用 request 对象传递数据，因此需要在登录成功后在 session 对象中保存该 用户的信息，从而使得 welcome.jsp 页面能够动态获取用户名。另外，内部页面表示只有成功登录后才有权限访问的页面，该功能只需在访问内部页面时先判断 session 对象中有无用 户信息即可。

**（1）登录页面 login.jsp 同例10-1**

**（2）向 LoginServlet 中的 doPost()方法中添加**

```java
if ("jason".equals(username) && "123".equals(password)) {
    // ...
    HttpSession session = request.getSession();
    session.setAttribute("username", username);
    response.sendRedirect("welcome.jsp");
    // ...
}
```

**（3）修改 welcome.jsp 代码**

```html
<body>
    <h1>登录成功，欢迎您，<%= session.getAttribute("username") %>!</h1>
    <a href="<%= request.getContextPath() %>/logout">注销 </a>
    <div>
        这是页面主内容。
    </div>
</body>
```

**在登录页面输入正确的用户名和密码，跳转到 welcome.jsp 页面**

（此处需结合幻灯片中的图片讲解：展示欢迎页面，显示“登录成功，欢迎您，jason!” 以及注销链接。）

**（4）注销用户**

```java
@WebServlet(name = "LogoutServlet", urlPatterns = "/logout")
public class LogoutServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        session.invalidate(); //注销 session
        response.sendRedirect("/login.jsp");
    }
}
```

**另外一种比较通用的设置 session 失效时间的方法，是在项目的 web.xml 中配置：**

```xml
<session-config>
    <session-timeout>30</session-timeout>
</session-config>
```

**（5）在内部页面上添加 session 控制**

**inner.jsp**

```html
<body>
<%
    String username = (String) session.getAttribute("username");
    if (username == null) {
        response.sendRedirect("login.jsp");
    }
%>
    <h2>内部资料，请欣赏！</h2>
</body>
```

（此处需结合幻灯片中的图片讲解：展示访问内部页面显示的“内部资料，请欣赏！”内容。）

#### 总结

*   **Session对象（常用）**
    *   理解含义和作用
*   **Cookie对象**
    *   注意与Session对象的区别

## 第11章 EL和JSTL标签

### 概述

*   **使用 JSP 技术做开发，为了获取域对象中存储的数据通常需要将 JSP 脚本和 HTML 标签混合使用，这样做会使 JSP 页面混乱、难以维护。为此，JSP2.0 规范中提供了 EL 表达式 和 JSTL 标签来对 JSP 页面进行优化**

### EL表达式

#### 概述

*   EL 表达式主要用于在页面显示数据
*   简单、便于维护
*   语法：`${ expr }`
*   **入门案例：从 Session 的范围中，取得 user 对象的 username**

    *   **使用JSP表达式**

```html
User user = (User)session.getAttribute("user");
<h2>欢迎您，<%= user.getUserName() %></h2>
```

    *   **使用EL表达式：**

```html
${sessionScope.user.username}

${sessionScope["user"]["username"]}
```

#### `.` VS `[]`

*   **除了`.`操作符，EL还可以使用`[]`操作符**
*   **如 `requestScope[“scope”]`**
*   **一般两者都可替代，遇到特殊情况要注意**
    *   当属性名包含了特殊字符如“.”或“-”等的情况下
        `requestScope.user.user-Name` (错误)
        `requestScope.user["user-Name"]` (正确)
    *   “`[]`”操作符中可以使用变量实现动态访问
        一般配合JSTL标签使用，详见JSTL标签部分

#### EL 表达式的作用域对象

**EL 表达式分别提供了 4 种作用域访问对象来实现数据的读取**

**表 11-1 EL 的作用域访问对象**

| 名称 | 说明 |
| :--- | :--- |
| pageScope | 与 pageContext 对象相关联，主要用于获取页面范围內的数据 |
| requestScope | 与 request 对象相关联，主要用于获取请求范围內的数据 |
| sessionScope | 与 session 对象相关联，主要用于获取会话范围內的数据 |
| applicationScope | 与 application 对象相关联，主要用于获取应用程序范围內的数据 |

**如果程序中未指定查找范围，那么系统会自动按照 page->request->session->application 的顺序进行查找**

**elScope.jsp**

```html
<body>
    <%pageContext.setAttribute("username", "班主任");%>
    <%request.setAttribute("username", "教导主任");%>
    <%session.setAttribute("username", "校长");%>
    <%application.setAttribute("username", "教育部长");%>
    指定范围的情况：<br>
    ======${pageScope.username} <br>
    ======${requestScope.username} <br>
    ======${sessionScope.username} <br>
    ======${applicationScope.username} <br>
    不指定范围的情况：<br>
    ======${username}:
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器输出结果，显示各作用域对应的值，以及不指定范围时默认获取的优先级最高的值）

#### EL 中其它内置对象

*   **EL 中还存在其它常用的内置对象**

**表 11-2 EL 其它内置对象**

| 内置对象 | 功能描述 |
| :--- | :--- |
| param | 用来获取特定属性的请求参数，例如：`${param.name}` 等价于 `request.getParameter(String name)` |
| paramValues | 用来获取特定属性的所有参数值，例如：`${paramValues.name}` 等价于 `request.getParameterValues(String name)` |
| header | 用来获取特定 HTTP 请求的头字段信息，例如：`${header["User-Agent"]}`表示获取用户的浏览器版本本信息 |
| headerValues | 用来获取特定 HTTP 请求的头字段信息，该头字段可能包含多个不同的值 |
| cookies | 用来获取客户端的 Cookie 信息 |

**例 11.2： EL 其它内置对象**

**regist.jsp**

```html
<body>
    <form action="doReg.jsp" method="post">
        用户名: <input type="text" name="username"><br>
        性别: <input type="radio" name="sex" value="男">男
              <input type="radio" name="sex" value="女">女 <br>
        爱好: <input type="checkbox" name="like" value="体育">体育
              <input type="checkbox" name="like" value="音乐">音乐
              <input type="checkbox" name="like" value="美术">美术
        <br>
        <input type="submit" value="提交"><input type="reset" value="重填">
    </form>
</body>
```

（此处需结合幻灯片中的图片讲解：展示注册表单页面，包含用户名输入框、性别单选框、爱好复选框及提交按钮）

**doReg.jsp**

```html
<body>
    <%request.setCharacterEncoding("UTF-8");%>
    用户名: ${param.username} <br>
    性别: ${param.sex} <br>
    爱好: ${paramValues.like[0]} <br>
    浏览器信息: ${header["User-Agent"]} <br>
    编码信息: ${headerValues["Accept-Encoding"][0]}<br>
</body>
```

（此处需结合幻灯片中的图片讲解：展示doReg.jsp页面的运行结果，显示了提交的用户名、性别、选中的第一个爱好、浏览器信息以及编码信息）

### JSTL标签

#### 概述

*   **使用 EL 表达式已经实现了页面输出的优化，但 EL 表达式无法实现逻辑处理，如循环、 条件判断等**
*   **JSTL（Java Server Pages Standard Tag Library， JSP 标准标签库）包含了在开发 JSP 时经常使用的标准标签，这些标签提供了一种不用嵌套 Java 代码就可以实现复杂JSP 开发的途径**
*   **要想在 JSP 页面中使用 JSTL 标签，必须完成以下几项准备工作**
    *   下载 JSTL 所需的 jstl.jar 和 standard.jar 等 jar 包
    *   在 JSP 页面中添加标签指令，指令代码如下（prefix 可修改）

```html
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
```

上述代码中 uri 的值 `http://java.sun.com/jsp/jstl/core` 表示 JSTL 的核心标签库；prefix 属性表示标签库的缩写（一般设值为“c”，也可指定其它的值

#### 常用 JSTL 标签

| 标签 | 说明 |
| :--- | :--- |
| `<c:out />` | 输出文本内容到 out 对象，常用于显示特殊字符 |
| `<c:set />` | 在作用域中设置变量或对象属性的值 |
| `<c:remove />` | 在作用域中移除变量的值 |
| `<c:if />` | 实现 if 条件判断结构 |
| `<c:choose />` | 须结合`<c:when>`和`<c:otherwise>`，实现 switch-case 结构 |
| `<c:forEach />` | 实现循环结构 |
| `<fmt:formatDate />` | 格式化时间 |

#### `<C:OUT>`标签

**`<c:out>`标签,语法如下：**

`<c:out value=”value” default=”default” escapeXml=”true|false” />`

其中，value 表示需要输出显示的表达式，default 表示默认输出显示的值，excapeXml 表示是否对输出的内容进行转义

```html
<body>
    <%
        String items[] = new String[2];
        items[0] = "JSTL OUT 标签测试";
        items[1] = "<h2>有 HTML 标记的内容</h2>";
        request.setAttribute("items", items);
    %>
    输出默认值: <c:out value="${b}" default="JSTL OUT" /> <br>
    Item0: <c:out value="${items[0]}">JSTL OUT 标签</c:out> <br>
    Item1 (转义) :<c:out value="${items[1]}" /> <br>
    Item1 (不转义) <c:out value="${items[1]}" escapeXml="false"/> <br>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器输出结果，Item1转义时显示标签源码，不转义时解析HTML标签显示粗体文字）

#### `<C:SET>`和`<C:REMOVE>`

**`<c:set>`标签是用来在某个范围（request、session 或者 application）内设置某个对象的**

`<c:set var=”name” value=”value” [scope=”page|request|session|application”] />`

**`<c:remove>`标签用于删除作用域范围内的变量，其语法格式如下**

`<c:remove var=”name” [scope=”page|request|session|application”] />`

```html
<body>
    <c:set var="var" value="page 变量" scope="page" />
    <c:set var="var" value="request 变量" scope="request" />
    <c:set var="var" value="session 变量" scope="session" />
    <c:remove var="var" scope="page" />
    <c:out value="${pageScope.var}" default="默认变量"/> <br>
    <c:out value="${requestScope.var}"/> <br>
    <c:out value="${sessionScope.var}"/> <br>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器输出结果，pageScope显示默认变量，requestScope和sessionScope显示设置的值）

#### `<C:IF>`

*   **`<c:if>`条件标签可以用来替代 Java 中的 if 语句**

`<c:if test=”condition” var=”var” [scope=”page|request|session|application”] />`

```html
<body>
    <%
        User user = new User(1, "jason", "123", "jason@gmail.com");
        request.setAttribute("user", user);
        request.setAttribute("number", 4);
    %>
    <c:if test="${not empty user}">遍历集合</c:if>
    <c:if test="${number mod 2 == 0}">${number}是偶数</c:if>
</body>
```

（此处需结合幻灯片中的图片讲解：展示浏览器输出结果，“遍历集合”和“4是偶数”）

#### `<C:CHOOSE>`标签

*   **使用<c:if>标签不能表达 if-else 逻辑结构，因此 JSTL 核心标签库提供了`<c:choose>`标签，该标签必须与`<c:when>`和`<c:otherwise>`一起使用**

```html
<body>
    <%
        session.setAttribute("username", "jason");
    %>
    <c:choose>
        <c:when test="${empty sessionScope.username}">
            <h2>请先登录</h2>
        </c:when>
        <c:otherwise>请欣赏！</c:otherwise>
    </c:choose>
</body>
```

#### `<C:FOREACH>`标签

*   **core 标签库提供了一个<c:forEach>标签专门用于迭代集合对象，如 Set、List、 Map 等**

`<c:forEach var=”var” items=”items” varStatus=”status”`

**items 表示要迭代的集合对象的名称，var 表示迭代过程中当前元素的名称，varStatus 表示当前循环的状态变量**

```html
<body>
    <%
        List<String> list = new ArrayList<>();
        list.add("aaa");
        list.add("bbb");
        list.add("ccc");
        request.setAttribute("list", list);
    %>
    <c:forEach items="${list}" var="str" varStatus="s">
        ${s.index} ${s.count} ${str} <br>
    </c:forEach>
```

（此处需结合幻灯片中的图片讲解：展示浏览器输出结果，显示列表元素的索引、计数和值）

#### `<FMT:FORMATDATE />`

**可以使用格式化标签`<fmt:formatDate>`来格式化展示日期**

`<fmt:formatDate value=”date” pattern=”yyyy-MM-dd HH:mm:ss”>`

**其中，value 表示时间对象，pattern 表示日期显示格式**

```html
<%
    Date date = new Date();
    pageContext.setAttribute("date", date);
%>
<span >发布时间: <fmt:formatDate value="${pageScope.date}" pattern="yyyy 年 MM 月 dd 日" /> <br>
<span >发布时间: <fmt:formatDate value="${pageScope.date}" pattern="yyyy 年 MM 月 dd 日 HH 点 mm 分 ss 秒" /> <br>
```

（此处需结合幻灯片中的图片讲解：展示浏览器输出结果，显示两种不同格式的发布时间）

### 总结

*   **EL表达式取值**
*   **JSTL条件标签、循环标签**


## 第12章 过滤器和监听器

### 过滤器

#### FILTER简介

*   **当一个应用程序中有很多页面都需要进行相同功能的显示控制时，使用过滤器则可以极大地提高控制效果，同时也降低了开发成本，提高了工作效率。**
*   **过滤器（Filter）的基本功能就是可以动态地拦截请求和响应，从而在执行目标 Servlet 的业务代码前后处理或实现一些特殊的功能**

（此处需结合幻灯片中的图片讲解：展示过滤器处理前后请求发送至Web资源以及Web资源响应时的过滤流程图）

#### FILTER类

*   **本质上是一个实现了 javax.servlet.Filter 接口的类，该接口中定义了三个方法**

**表 12-1 Filter 常见方法**

| 方法声明 | 功能描述 |
| :--- | :--- |
| `Init(FliterConfig config)` | 该方法用来初始化过滤器，FilterConfig 对象用于读取初始化参数信息 |
| `doFilter(ServletRequest request, ServletResponse response, FilterChain chain)` | doFilter 方法被 Servlet 容器调用，同时传入分别指向这个请求/响应链中的 ServletRequest、ServletResponse 和 FilterChain 对象的引用，该方法主要用来处理客户端请求，并将处理任务传递给链中的下一个资源(通过调用 Filter Chain 对象引用的 doFilter 方法) |
| `destroy()` | 容器在垃圾收集之前调用 destroy()方法，以便能够执行任何必需的清理代码 |

#### 过滤器的基本使用

*   **在 IDEA 中创建新的 Web 工程 bookChapter12，在 src 目录下创建 filter 包，并在该包下创建 FirstFilter 过滤器**

```java
@WebFilter(filterName = "FirstFilter", urlPatterns = "/*",
    initParams={
        @WebInitParam(name="ok", value="initParam1"),
        @WebInitParam(name="error", value="initParam2")
    } )
public class FirstFilter implements Filter {
    public void destroy() {
        System.out.println("过滤器销毁。。");
    }
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        System.out.println("到达目标资源前先经过这里");
        chain.doFilter(req, resp); // 将请求发送到下一个资源
        System.out.println("返回响应前先经过这里");
    }
    public void init(FilterConfig config) throws ServletException {
        String p1 = config.getInitParameter("ok");
        String p2 = config.getInitParameter("error");
        System.out.println(p1 + "====" + p2);
    }
}
```

*   **2）创建 TestFilterServlet 程序测试上述过滤器**

```java
@WebServlet(name = "FilterTestServlet", urlPatterns = "/test")
public class FilterTestServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("目标资源代码执行中。。。");
    }
}
```

**启动 Tomcat 服务器，在浏览器中输入 URL 地址 http://localhost:8080/chap12/test**

（此处需结合幻灯片中的图片讲解：展示控制台输出日志，显示过滤器初始化参数、到达目标资源前的日志、目标资源执行日志以及返回响应前的日志顺序）

#### FILTER 的分类

*   **根据 HTTP 请求资源方式的不同，过滤器可分成不同的类别**

**表 12-2 过滤器分类表**

| 类型 | 作用 |
| :--- | :--- |
| REQUEST | 默认值，浏览器直接请求资源 |
| FORWARD | 服务端转发访问资源 |
| INCLUDE | 包含访问资源 |
| ERROR | 错误跳转资源 |
| ASYNC | 异步访问资源 |

没有配置其类型，默认属于 REQUEST 类型的过滤器。可以通过 `@WebFilter` 注解的 `dispatcherTypes`属性配置过滤器的类型

#### ForwardFilter.java

```java
@WebFilter(filterName = "ForwardFilter",urlPatterns = "/*",
        dispatcherTypes = DispatcherType.FORWARD)
public class ForwardFilter implements Filter {
    //省略 destory()方法
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        System.out.println("Forward 类型过滤器拦截请求");
        chain.doFilter(req, resp);
        System.out.println("Forward 类型过滤器拦截响应");
    }
    //省略 init()方法
}
```

**上述过滤器只会拦截服务端转发的请求，而不会拦截客户端直接发送的请求**

#### ForwordFilterServlet.java

```java
@WebServlet(name = "ForwordFilterServlet",urlPatterns = "/forward")
public class ForwordFilterServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("test.jsp").forward(request, response);
    }
}
```

**在地址栏输入 URL 地址 http://localhost:8080/chap12/forward**

（此处需结合幻灯片中的图片讲解：展示控制台日志，显示Forward类型过滤器成功拦截了请求和响应）

#### 主要用途1

*   **统一处理中文乱码**

```java
@WebFilter(filterName="encoding",urlPatterns="/*")
public class EncodingFilter implements Filter{
```

```java
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    // TODO Auto-generated method stub
    request.setCharacterEncoding("utf-8");
    response.setCharacterEncoding("utf-8");
    response.setContentType("text/html;charset=UTF-8");
    
    System.out.println("我是encoding过滤器");
    
    chain.doFilter(request, response);
}
```

#### FILTER 链

*   **Web 应用程序中可以注册多个 Filter 程序，每一个 Filter 程序都可以针对某一个URL 进行拦截。如果多个 Filter 程序都对同一个 URL 进行拦截，那么这些 Filter 就会组成一个 Filter 链**

（此处需结合幻灯片中的图片讲解：展示图 12-4 过滤器链原理图，描述用户请求经过Filter1、Filter2到达Web资源，再反向经过Filter2、Filter1返回的过程）

#### 过滤器先后顺序的问题

*   **注解配置：** 按照类名的字符串比较规则比较，值小的先执行，如 AFilter 和 BFilter， 由于在字母表中字母 A 排在字母 B 前面，因此 AFilter 就先执行
*   **web.xml 配置：** 根据定义的元素位置排序，定义在上面的先执行

将例 12.2 中 ForwardFilter 的 DispatcherType 改成 REQUEST，同时打开 FirstFilter。

（此处需结合幻灯片中的图片讲解：展示控制台日志，验证过滤器的执行顺序）

#### 应用案例

###### 统一解决中文乱码

```java
@WebFilter(filterName = "EncodingFilter", urlPatterns = "/*")
public class EncodingFilter implements Filter {
    // 省略 destroy() 和 init() 方法
    
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest)req;
        HttpServletResponse response = (HttpServletResponse)resp;
        //在放行之前处理编码
        request.setCharacterEncoding("utf-8");
        response.setHeader("content-type" , "text/html;charset=utf-8");
        chain.doFilter(request, response);
    }
}
```

###### 统一解决用户登录后访问内部页面问题

**LoginFilter.java**

```java
@WebFilter(filterName = "LoginFilter",urlPatterns = "/*")
public class LoginFilter implements Filter {
    // 省略 destroy() 和 init() 方法
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        // 判断如果没有取到用户信息,就跳转到登陆页面
        if (username == null || "".equals(username)) {
            // 转发到登陆页面
            request.getRequestDispatcher("login.jsp").forward(request,response);
        }
        else {
            // 已经登陆，放行
            chain.doFilter(request,response);
        }
    }
}
```

### 监听器

#### 监听器概述

*   **本质上 Servlet 事件监听器就是一个实现特定接口的 Java 程序，专门用于监听Web 应用程序中 ServletContext、HttpSession 和 ServletRequest 等域对象的创建和销毁过程，以及监听这些域对象属性的修改。根据监听事件的不同可以将其分成三类**
    *   用于监听域对象创建和销毁的事件监听器
    *   用于监听域对象中属性变更的事件监听器
    *   用于监听绑定 HttpSession 域中某个对象状态的事件监听器

**上述三类监听事件都定义了相应的接口，在编写事件监听器程序时只需实现对应的接口 就可以实现监听功能**

#### 8 大监听器接口

*   **开发中监听事件主要对应 8 个监听器接口**

| 监听器接口 | 功能描述 |
| :--- | :--- |
| ServletContextListener | 类别（1），实现该接口可以在 ServletContext 对象初始化或者销毁时得到通知 |
| HttpSessionListener | 类别（1），实现该接口可以在 HttpSession 对象创建或失效前得到通知 |
| ServletRequestListener | 类别（1），实现该接口可以在 ServletRequest 对象创建或销毁前得到通知 |
| ServletContextAttributeListener | 类别（2），实现该接口可以在 ServletContext 对象的属性列表发生变化时得到通知 |
| ServletRequestAttributeListener | 类别（2），实现该接口可以在 ServletRequest 对象的属性列表发生变化时得到通知 |
| HttpSessionAttributeListener | 类别（2），实现该接口可以在 HttpSession 对象的属性列表发生变化时得到通知 |
| HttpSessionBindingListener | 类别（3），实现该接口可以使一个对象在 session 或者从 session 中删除时得到通知 |
| HttpSessionActivationListener | 类别（3），实现该接口的对象如果绑定到 session 中，当 session 被钝化或者激活时，Servlet 容器通知该对象 |

#### 监听域对象创建和销毁的事件监听器

*   **ServletContext 监控：对应监控 application 内置对象象的创建和销毁**

**MyContextListener.java**

```java
@WebListener()
public class MyContextListener implements ServletContextListener{
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Web 容器启动时，调用此方法");
    }
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("Web 容器关闭时，调用此方法");
    }
}
```

上述代码使得当 web 容器启动时，执行 contextInitialized()方法；当容器关闭或重启时， 执行 contextDestroyed()方法。该监听事件主要在启动 Web 应用时初始化配置信息，或者是 在关闭 Web 应用时需要回收一些资源时使用。

#### HTTPSESSION 监控

**MySessionListener.java**

```java
@WebListener()
public class MySessionListener implements HttpSessionListener {
    public void sessionCreated(HttpSessionEvent se) {
        /* Session is created. */
        System.out.println("Session 对象创建时调用该方法");
    }
    public void sessionDestroyed(HttpSessionEvent se) {
        /* Session is destroyed. */
        System.out.println("Session 对象销毁时调用该方法");
    }
}
```

上述代码使得当一个用户访问网站时容器就会创建一个 HttpSession 对象，从而调用 sessionCreated()方法，当用户离开网站时容器就会销毁一个 HttpSession 对象，从而自动调用 sessionDestroyed()方法。该特性可用于统计站点当前在线人数

###### 例 12.5：统计当前在线人数

该监听器中还需要有 一个 ServletContext 域对象范围的变量来记录总人数

```java
@WebListener()
public class CountUserListener implements HttpSessionListener{
    private int count = 0; // 用于统计在线人数
    public void sessionCreated(HttpSessionEvent se) {
        count++;
        se.getSession().getServletContext().setAttribute("count", count);
    }
    public void sessionDestroyed(HttpSessionEvent se) {
        count--;
        se.getSession().getServletContext().setAttribute("count", count);
    }
}
```

**count.jsp**

```html
<body>
    当前人数为: ${applicationScope.count} <br>
    <a href="${pageContext.request.contextPath}/logout">退出登录</a>
</body>
```

可以通过打开不同浏览器来模拟多用户多会话的场景，以不同浏览器 连续访问该页面 3 次

（此处需结合幻灯片中的图片讲解：展示浏览器访问count.jsp页面，显示当前在线人数统计的效果）

#### SERVLETREQUEST监听

**MyRequestListener.java**

```java
@WebListener()
public class MyRequestListener implements ServletRequestListener {
    @Override
    public void requestDestroyed(ServletRequestEvent servletRequestEvent) {
        System.out.println("销毁 request 请求时，调用该方法");
    }
    @Override
    public void requestInitialized(ServletRequestEvent servletRequestEvent) {
        System.out.println("创建 request 请求时，调用该方法");
    }
}
```

#### 监听对象中属性的变更

*   **监听对象属性的新增、删除和修改的监听器也可以划分成三种。分别针对于 ServletContext、HttpSession、ServletRequest 对象，容器根据传入方法参数类型的不同，而 监听不同域对象属性的变更**

```java
public class MyContextAttrListener implements ServletContextAttributeListener{
    // application 对象中添加属性时，调用该方法
    public void attributeAdded(ServletContextAttributeEvent hsbe) {
        System.out.println("application 对象中添加属性 :name=" +hsbe.getName());
    }
    // application 对象中删除属性时，调用该方法
    public void attributeRemoved(ServletContextAttributeEvent hsbe) {
        System.out.println("application 对象中删除属性 :name="+hsbe.getName());
    }
    // application 对象中更改属性时，调用该方法
    public void attributeReplaced(ServletContextAttributeEvent hsbe) {
        System.out.println("application 对象中修改属性 :name="+hsbe.getName());
    }
}
```

**实现 HttpSessionAttributeListener接口**

```java
public class MyHttpSessionAttrListener implements HttpSessionAttributeListener{
    // session 对象中添加属性时，调用该方法
    public void attributeAdded(HttpSessionBindingEvent hsbe) {
        System.out.println("session 对象中添加属性:name = "+hsbe.getName());
    }
    // session 对象中删除属性时，调用该方法
    public void attributeRemoved(HttpSessionBindingEvent hsbe) {
        System.out.println("session 对象中删除属性:name = "+hsbe.getName());
    }
    // session 对象中修改属性时，调用该方法
    public void attributeReplaced(HttpSessionBindingEvent hsbe) {
        System.out.println("session 对象中修改属性:name = "+hsbe.getName());
    }
}
```

**实现 ServletRequestAttributeListener接口**

```java
public class MyServletRequestAttrListener implements
                                        ServletRequestAttributeListener{
    // request 对象中添加属性时，调用该方法
    public void attributeAdded(ServletRequestAttributeEvent hsbe) {
        System.out.println("request 对象中添加属性 :name = "+hsbe.getName());
    }
    // request 对象中删除属性时，调用该方法
    public void attributeRemoved(ServletRequestAttributeEvent hsbe) {
        System.out.println("request 对象中删除属性 :name = "+hsbe.getName());
    }
    // request 对象中修改属性时，调用该方法
    public void attributeReplaced(ServletRequestAttributeEvent hsbe) {
        System.out.println("request 对象中修改属性 :name = "+hsbe.getName());
    }
}
```

#### 监听对象状态的事件监听器

*   **Web 应用程序开发中经常使用 Session 域来存储对象，每个对象在该域中都有多种状态， 如绑定（添加）到 Session 域中、从 Session 域中解除绑定（删除）、随 Session 对象持久化 到一个存储设备中（钝化）、随 Session 域从一个存储设备中回复（激活）等状态**
*   **Servlet API 提供了两个特殊的监听器接口 HttpSessionBindingListener 和 HttpSessionActivationListener，这两个接口专门用于监听 JavaBean 对象在 Session 域中的状态**

###### HttpSessionBindingListener 接口

可以通过实现 HttpSessionBindingListener 接口，监听 JavaBean 对象的绑定和解绑事件，该接口的绑定和解绑事件分别对应两个事件处理方法：valueBound()方法和 valueUnbound()方法

**例 12.6： 监听某特定用户（比如“小明”）是否上线**

分析：用户成功登录到站点后，一般会在 session 对象中保存用户的登录信息（用户名 或用户对象等），通过这一事件可以监听到某特定用户是否上线。

**User.java**

```java
public class User implements HttpSessionBindingListener{
    private String username;
    private String password;
    //...// 省略构造方法
    @Override
    public void valueBound(HttpSessionBindingEvent hsbe) {
        if (this.getUsername().equals("小明")){
            System.out.println("小明登录了，警告发出。");
        }
    } // this表示绑定和解绑的session对象
    @Override
    public void valueUnbound(HttpSessionBindingEvent hsbe) {
        if (this.getUsername().equals("小明")){
            System.out.println("小明下线了，警告发出。");
        }
    }
    //...// 省略 get() 和 set() 方法
}
```

**LoginServlet.java**

```java
@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if ("小明".equals(username) && "123".equals(password)) {
            User user = new User(username, password);
            request.getSession().setAttribute("user", user);
            response.sendRedirect("index.jsp");
        }else {
            response.sendRedirect("login.jsp");
        }
    }
}
```

*   黑色粗体部分，会触发 User 对象调用 valueBound()方法来处理该事件， 该方法根据 this 对象（当前绑定的用户对象）获取用户名属性来判断某特定的用户是否上线。
*   当用户注销后会触发 User 对象调用 valueUnbound()方法从而能监听到当前用户已经离线

在 login.jsp 输入用户名“小明”和密码“123”登录成功后，点击“注销”超链接，控制台 打印登录和下线信息，

（此处需结合幻灯片中的图片讲解：展示控制台日志，显示session销毁及小明下线的警告信息）

###### HttpSessionActivationListener接口

*   HttpSession 域对象中保存大量访问网站相关的重要信息，但是过多的 session 数据会占 用过多的内存，引起服务器性能的下降。为了解决这一问题，Web 容器会将不常使用的 session 数据序列化到本地文件中，这一过程称为钝化。当需要再次访问到该 session 的内容时，就 会读取本地文件放入内存中，这个过程称为活化（激活）
*   **为了监听 HttpSession 中对象钝化 和活化的过程，Servlet API 提供了 httpSessionActivationListener 接口，该接口定义了 sessionWillPassivate()方法和 sessionDidActivate()方法分别对应对象的钝化和活化事件处理 方法。需要注意的是，对象序列化还需要实现 Serializable 接口**

**1) 创建 Employee.java 实现 Serializable 和 HttpSessionActivationListener接口**

```java
public class Employee implements HttpSessionActivationListener, Serializable {
    private int id;
    private String name;
    private double salary;
    // 省略构造方法和 get() 和 set() 方法
    @Override
    public void sessionWillPassivate(HttpSessionEvent httpSessionEvent) {
        System.out.println("Employee 被钝化了");
    }
    @Override
    public void sessionDidActivate(HttpSessionEvent httpSessionEvent) {
        System.out.println("Employee 被激活了");
    }
}
```

上述代码中的 `sessionWillPassivate()` 和 `sessionDidActivate()` 方法分别对应对象的“钝化” 和“激活”过程。

**（2）在 Tomcat 安装目录中的 context.xml文件中添加如下配置**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Context>
    <!-- maxIdleSwap:session 中的对象多长时间不使用就钝化，单位为秒 -->
    <!-- directory:钝化后的对象的文件写到磁盘的哪个目录下-->
    <Manager className="org.apache.catalina.session.PersistentManager"
        maxIdleSwap="100">
        <Store className="org.apache.catalina.session.FileStore"
            directory="/javaweb" />
    </Manager>
</Context>
```

其中 maxIdleSwap 属性用于指定 Session 被钝化前的空闲时间间隔（单位秒），这里设置 为 100 秒，directory 属性指定保存对象持久化文件的目录

**3）创建 SessionActionServlet.java 构造 Employee 并添加到session对象中**

```java
@WebServlet(name = "SessionActionServlet", urlPatterns = "/active")
public class SessionActionServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String method = request.getParameter("method");
        if (method.equals("write")){
            Employee emp = new Employee(1, "Jason", 9999);
            request.getSession().setAttribute("emp", emp);
            System.out.println("Employee 被放到 session 域中了");
        }else if (method.equals("read")){
            Employee emp= (Employee)(request.getSession().getAttribute("emp"));
            System.out.println("从 session 域中读取 Employee 对象: " + emp.getName());
        }
    }
}
```

在浏览器中输入 URL 地址 `http://localhost:8080/chap12/active?method=write`，过 100 秒后控制台显示

（此处需结合幻灯片中的图片讲解：展示控制台日志，显示Employee被放到session中，以及Employee被钝化的信息）

在浏览器中输入 URL 地址 `http://localhost:8080/chap12/active?method=read`，控制台显示

（此处需结合幻灯片中的图片讲解：展示控制台日志，显示Employee被激活，以及从session中读取对象的信息）

值得一提的是，IDEA 中 session 对象“钝化”的数据文件所在的目录和 Eclipse 有所不 同，读者首先可以根据 Tomcat 的启动信息，找到项目部署的目录

在上述目录下的 `work\Catalina\localhost\chap12\javaweb` 下保存着 session 对象“钝化” 的数据，如

（此处需结合幻灯片中的图片讲解：展示文件系统中生成的session钝化文件）

#### 总结

*   **过滤器的原理及其在实际开发中的应用**
*   **监听器的原理及其在实际开发中的应用**