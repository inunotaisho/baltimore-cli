# Baltimore CLI

The the Baltimore CLI is based on the Platypi CLI which originates from Birmingham, Alabama. Baltimore CLI is the primary way to create and manage monile or desktop apps using various frontend and backend frameworks. 

The Baltimore CLI allows a developer to use 1 of 4 frontend frameworks. Platypi, as built by the original designers and homage to its creators. React, as it is one of the more popular framework in Baltimore, Maryland. AngularJS, as it is the best beginner framework and finally Angular as it planned to replace AngularJS and it removes the digest cycle.

The Baltimore CLI also allows for 1 of 5 popular backend frameworks. The first is Ruby on Rails, as it is used widly in Baltimore. The second and most obvious is ExpressJS.


 It can be used to create new projects as well as add different components (models, repositories, services, injectables, and controls) to the app.

## Installation

Use `npm` to install this package.

Globally (preferred)
```shell
npm install baltimore-cli -g
```

or, Locally
```shell
npm install baltimore-cli --save-dev
```

## Usage

All commands are run with `balt <command>`. You can run `balt <command> -h` for further help. The help menus cascade.

So `balt create app -h` will show you a different help menu than `balt create -h` or `balt create viewcontrol -h`.

### create

Creates a new project or component in the specified directory. Walks you through a series of prompts to determine the project specifications.

> **NOTE:** You can use `balt c` as an alias for `balt create`

#### Examples

Create a new project in the current directory:
```shell
balt create
```

Create a new project MyProject in its own directory
```shell
balt create -n MyProject --dir myproject
```

Create a ViewControl component in the project-specified default location for viewcontrols (e.g. ./app/viewcontrols/home)
```shell
balt create viewcontrol -n Home
```

Create a ViewControl component in ./app/viewcontrols/posts/list
```shell
balt create viewcontrol -n List --dir posts/
```

Create a ViewControl component that extends another ViewControl
```shell
balt create viewcontrol -n PostsByTag --extends ../list/list.vc
```

> **NOTE:** When extending components, the exact path you specify will be used as the import path. The path specified must have the component listed as its default export.

#### Component aliases
When specifying components you can choose to use their full name or an alias:

```
viewcontrol      | vc
templatecontrol  | tc
attributecontrol | ac
model            | mdl
repository       | repo
service          | svc
injectable       | inj
```

#### Useful Options

```shell
-n, --name <name> Specifies the name of the file
-d, --dir <directory> Used to specify the directory in which to create the project or component
```

### cordova

You can run `balt cordova` from anywhere in your project, and it will run `cordova` commands from within the scope of the `/cordova` folder of your project.

#### Examples

Run your cordova project on an Android device **from the /cordova folder** of your project.

```shell
cordova run android --device
```

Run your cordova project on an Android device **from the / folder** of your project.

```shell
balt cordova run android --device
```

This will work with any cordova command. You can type `balt cordova -h` for more information.
