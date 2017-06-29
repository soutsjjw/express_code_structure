# Express Code Structure

This project is an example of how to organize a medium-sized express.js web application.

**Current to at least express v4.14 December 2016**

[![Build Status](https://semaphoreci.com/api/v1/projects/0de47c2f-0e4f-4a47-8822-5913023312e1/681770/badge.svg)](https://semaphoreci.com/focusaurus/express_code_structure)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## How big is your application?

Web applications are not all the same, and there's not, in my opinion, a single code structure that should be applied to all express.js applications.

If your application is small, you don't need such a deep directory structure as exemplified here. Just keep it simple and stick a handful of `.js` files in the root of your repository and you're done. Voilà.

If your application is huge, at some point you need to break it up into distinct npm packages. In general the node.js approach seems to favor many small packages, at least for libraries, and you should build your application up by using several npm packages as that starts to make sense and justify the overhead. So as your application grows and some portion of the code becomes clearly reusable outside of your application or is a clear subsystem, move it to it's own git repository and make it into a standalone npm package.

**So** the focus of this project is to illustrate a workable structure for a medium-sized application.

## What is your overall architecture

There are many approaches to building a web application, such as

  * Server Side MVC a la Ruby on Rails
  * Single Page Application style a la MongoDB/Express/Angular/Node (MEAN)
  * Basic web site with some forms
  * Models/Operations/Views/Events style a la [MVC is dead, it's time to MOVE on](http://cirw.in/blog/time-to-move-on.html)
  * and many others both current and historical

Each of these fits nicely into a different directory structure. For the purposes of this example, it's just scaffolding and not a fully working app, but I'm assuming the following key architecture points:

* The site has some traditional static pages/templates
* The "application" portion of the site is developed as a Single Page Application style
* The application exposes a REST/JSON style API to the browser
* The app models a simple business domain, in this case, it's a car dealership application

## And what about Ruby on Rails?

It will be a theme throughout this project that many of the ideas embodied in Ruby on Rails and the "Convention over Configuration" decisions they have adopted, though widely accepted and used, are not actually very helpful and sometimes are the opposite of what this repository recommends.

My main point here is that there are underlying principles to organizing code, and based on those principles, the Ruby on Rails conventions make sense (mostly) for the Ruby on Rails community. However, just thoughtlessly aping those conventions misses the point. Once you grok the basic principles, ALL of your projects will be well-organized and clear: shell scripts, games, mobile apps, enterprise projects, even your home directory.

For the Rails community, they want to be able to have a single Rails developer switch from app to app to app and be familiar and comfortable with it each time. This makes great sense if you are 37 signals or Pivotal Labs, and has benefits. In the server-side JavaScript world, the overall ethos is just way more wild west anything goes and we don't really have a problem with that. That's how we roll. We're used to it. Even within express.js, it's a close kin of Sinatra, not Rails, and taking conventions from Rails is usually not helping anything. I'd even say **Principles over Convention over Configuration**.

## Underlying Principles and Motivations

* Be mentally manageable
  * The brain can only deal with and think about a small number of related things at once. That's why we use directories. It helps us deal with complexity by focusing on small portions.
* Be size-appropriate
  * Don't create "Mansion Directories" where there's just 1 file all alone 3 directories down. You can see this happening in the [Ansible Best Practices](http://www.ansibleworks.com/docs/playbooks_best_practices.html) that shames small projects into creating 10+ directories to hold 10+ files when 1 directory with 3 files would be much more appropriate. You don't drive a bus to work (unless you're a bus driver, but even then your driving a bus AT work not TO work), so don't create filesystem structures that aren't justified by the actual files inside them.
* Be modular but pragmatic
  * The node community overall favors small modules. Anything that can cleanly be separated out from your app entirely should be extracted into a module either for internal use or publicly published on npm. However, for the medium-sized applications that are the scope here, the overhead of this can add tedium to your workflow without commensurate value. So for the time when you have some code that is factored out but not enough to justify a completely separate npm module, just consider it a "**proto-module**" with the expectation that when it crosses some size threshold, it would be extracted out.
  * Some folks such as [@hij1nx](https://twitter.com/hij1nx) even include an `app/node_modules` directory and have `package.json` files in the **proto-module** directories to facilitate that transition and act as a reminder.
* Be easy to locate code
  * Given a feature to build or a bug to fix, our goal is that a developer has no struggle locating the source files involved.
    * Names are meaningful and accurate
    * crufty code is fully removed, not left around in an orphan file or just commented out
* Be search-friendly
  * all first-party source code is in the `app` directory so you can `cd` there are run find/grep/xargs/ag/ack/etc and not be distracted by third party matches
* Use simple and obvious naming
  * npm now seems to require all-lowercase package names. I find this mostly terrible but I must follow the herd, thus filenames should use `kebab-case` even though the variable name for that in JavaScript must be `camelCase` because `-` is a minus sign in JavaScript.
  * variable name matches the basename of the module path, but with `kebab-case` transformed to `camelCase`
* Group by Coupling, Not by Function
  * This is a major departure from the Ruby on Rails convention of `app/views`, `app/controllers`, `app/models`, etc
  * Features get added to a full stack, so I want to focus on a full stack of files that are relevant to my feature. When I'm adding a telephone number field to the user model, I don't care about any controller other than the user controller, and I don't care about any model other than the user model.
  * So instead of editing 6 files that are each in their own directory and ignoring tons of other files in those directories, this repository is organized such that all the files I need to build a feature are colocated
  * By the nature of MVC, the user view is coupled to the user controller which is coupled to the user model. So when I change the user model, those 3 files will often change together, but the deals controller or customer controller are decoupled and thus not involved. Same applies to non-MVC designs usually as well.
  * MVC or MOVE style decoupling in terms of which code goes in which module is still encouraged, but spreading the MVC files out into sibling directories is just annoying.
  * Thus each of my routes files has the portion of the routes it owns. A rails-style `routes.rb` file is handy if you want an overview of all routes in the app, but when actually building features and fixing bugs, you only care about the routes relevant to the piece you are changing.
* Store tests next to the code
  * This is just an instance of "group by coupling", but I wanted to call it out specifically. I've written many projects where the tests live under a parallel filesystem called "tests" and now that I've started putting my tests in the same directory as their corresponding code, I'm never going back. This is more modular and much easier to work with in text editors and alleviates a lot of the "../../.." path nonsense. If you are in doubt, try it on a few projects and decide for yourself. I'm not going to do anything beyond this to convince you that it's better.
* Reduce cross-cutting coupling with Events
  * It's easy to think "OK, whenever a new Deal is created, I want to send an email to all the Salespeople", and then just put the code to send those emails in the route that creates deals.
  * However, this coupling will eventually turn your app into a giant ball of mud.
  * Instead, the DealModel should just fire a "create" event and be entirely unaware of what else the system might do in response to that.
  * When you code this way, it becomes much more possible to put all the user related code into `app/users` because there's not a rat's nest of coupled business logic all over the place polluting the purity of the user code base.
* Code flow is followable
  * Don't do magic things. Don't autoload files from magic directories in the filesystem. Don't be Rails. The app starts at `app/server.js:1` and you can see everything it loads and executes by following the code.
  * Don't make DSLs for your routes. Don't do silly metaprogramming when it is not called for.
  * If your app is so big that doing `magicRESTRouter.route(somecontroller, {except: 'POST'})` is a big win for you over 3 basic `app.get`, `app.put`, `app.del`, calls, you're probably building a monolithic app that is too big to effectively work on. Get fancy for BIG wins, not for converting 3 simple lines to 1 complex line.
* Use lower-kebab-case filenames
  * This format avoids filesystem case sensitivity issues across platforms
  * npm forbids uppercase in new package names, and this works well with that

## express.js specifics
* Don't use `app.configure`. It's almost entirely useless and you just don't need it. It is in lots of boilerplate due to mindless copypasta.
* THE ORDER OF MIDDLEWARE AND ROUTES IN EXPRESS MATTERS!!!
  * Almost every routing problem I see on stackoverflow is out-of-order express middleware
  * In general, you want your routes decoupled and not relying on order that much
  * Don't use `app.use` for your entire application if you really only need that middleware for 2 routes (I'm looking at you, `body-parser`)
  * Make sure when all is said and done you have EXACTLY this order:
    1. Any super-important application-wide middleware
    1. All your routes and assorted route middlewares
    1. THEN error handlers
* Sadly, being sinatra-inspired, express.js mostly assumes all your routes will be in `server.js` and it will be clear how they are ordered. For a medium-sized application, breaking things out into separate routes modules is nice, but it does introduce peril of out-of-order middleware

## The app symlink trick

There are many approaches outlined and discussed at length by the community in the great gist [Better local require() paths for Node.js](https://gist.github.com/branneman/8048520). I may soon decide to prefer either "just deal with lots of ../../../.." or use the [requireFrom](https://github.com/DSKrepps/requireFrom) modlue. However, at the moment, I've been using the symlink trick detailed below.

So one way to avoid intra-project requires with annoying relative paths like `require("../../../config")` is to use the following trick:

* create a symlink under node_modules for your app
  * cd node_modules && ln -nsf ../app
* add **just the node_modules/app symlink itself**, not the entire node_modules folder, to git
  * git add -f node_modules/app
  * Yes, you should still have "node_modules" in your `.gitignore` file
  * No, you should not put "node_modules" into your git repository. Some people will recommend you do this. They are incorrect.
* Now you can require intra-project modules using this prefix
  * `var config = require("app/config");`
  * `var DealModel = require("app/deals/deal-model")`;
* Basically, this makes intra-project requires work very similarly to requires for external npm modules.
* Sorry, Windows users, you need to stick with parent directory relative paths.

## Configuration

Generally code modules and classes to expect only a basic JavaScript `options` object passed in. Only `app/server.js` should load the `app/config.js` module. From there it can synthesize small `options` objects to configure subsystems as needed, but coupling every subsystem to a big global config module full of extra information is bad coupling.

Try to centralize creation of DB connections and pass those into subsystems as opposed to passing connection parameters and having subsystems make outgoing connections themselves.

### NODE_ENV

This is another enticing but terrible idea carried over from Rails. There should be exactly 1 place in your app, `app/config.js` that looks at the `NODE_ENV` environment variable. Everything else should take an explicit option as a class constructor argument or module configuration parameter.

If the email module has an option as to how to deliver emails (SMTP, log to stdout, put in queue etc), it should take an option like `{deliver: 'stdout'}` but it should absolutely not check `NODE_ENV`.

## Tests

I now keep my test files in the same directory as their corresponding code and use filename extension naming conventions to distinguish tests from production code.

- `foo.js` has the module "foo"'s code
- `foo.tape.js` has the node-based tests for foo and lives in the same dir
- `foo.btape.js` can be used for tests that need to execute in a browser environment

I use filesystem globs and the `find . -name '*.tape.js'` command to get access to all my tests as necessary.

### Integration Tests

Still same principle, but if your integration tests are coupled to the interactions across several subsystems, they go in the parent directory of those subsystems. For this example, that would mean putting integration tests directly in the `app` directory. If you have a lot of integration tests, organize them into subdirectories of `app` according to the same group-by-coupling and associated principles.

## How to organize code within each `.js` module file

This project's scope is mostly about where files and directories go, and I don't want to add much other scope, but I'll just mention that I organize my code into 3 distinct sections.

1. Opening block of CommonJS require calls to state dependencies
2. Main code block of pure-JavaScript. No CommonJS pollution in here. Don't reference exports, module, or require.
3. Closing block of CommonJS to set up exports



代码划分的基本原则和动机
* 可轻松管理
  * 我们的大脑适合处理少量有关联性的东西，所以我们使用了目录。它帮助我们集中处理每个小部分文件从而降低复杂性。
* 尺寸合适
  * 不要创建仅有一个文件的大目录。一个目录下至少放3个文件才是合适的。如同我们不需要开公交车去上班，开个小汽车就好了。因此请通过判断实际的文件数来决定是否需要创建一个文件夹。
* 恰当的模块化
  * Node社区几乎都是崇尚小模块的。但是对于一个中型应用而言，这种分离成小模块的时间开销并不会获得相应的价值体现。
* 容易定位代码
  * 开发一个功能或者修复一个bug时，我们的目标是让开发者可以轻松的定位源文件
  * 命名准确且有意义
  * 无用的代码请完全移除掉，不要留在一个单独的文件或者仅仅注释掉
* 搜索友好
  * 所有的源代码都放在第一个位置的app目录下，你可以通过cd命令就可以轻松找到
* 简明的命名
  * 现在npm似乎要求所有的包使用小写命名了。文件名使用kebab-case方式命名，变量使用camelCase方式命名，因为-这个符号在javascript语言中代表减号。
  * 变量名称匹配模块路径的基础名称,同时kebab-case会转换为camelCase
* 在代码旁边写上测试
  * 把测试写在代码旁边的同级目录中确实有好处，避免了"../../.."这样的路径引用，但个人认为还是要借助测试框架来完成测试工作，例如Mocha。
* 通过事件减少交叉耦合
  * 为了不使你的业务代码看起来像一团乱麻，必要的事件回调还是非常好的，尽量降低交叉引用，使你的模块保持独立。
* 代码流畅
  * app/server.js是应用启动的唯一入口。
  * 不要使用 DSLs(声明式语言) 作为路由，避免非必要的元编程.（PS: 过渡的封装是不好滴）
  * 不要使用 app.all 来代替 app.get\app.put\app.delete, 这无疑会使程序变得更复杂，需要更多的判断。
* 使用lower-kebab-case命名文件
  * 这种方式可以避免跨平台时的文件系统大小写敏感问题
  * npm禁止在新包名称中使用大写，目前这点工作得很好
  
