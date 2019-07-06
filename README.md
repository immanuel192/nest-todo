# nest-todo

## Requirements
The app should meet the following requirements:
- Application should stores data in a db but not necessary to be a real db. Db such as lowdb (https://github.com/typicode/lowdb) is ok.
- Api should be authenticated by Basic Auth;
- All user's password should be reverse of username and length > 0, e.g. username: zendesk123 password: 321ksednez
- Api should be able to add a todo
- Api should be able to complete a todo
- Api should be able to query todo list supporting `all`, `active`, `complete` filtering
- Api should be able to remove a todo
- Todo list is not shared between users
- Documentation of the api, such as path, param, examples
- Bonus: include a dockerfile

   
## Versioning
We use `semantic-release` to generate release notes. This make use of [conventional commit structure](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) for both the notes and release numbers.


### Setup:
- Create Github and NPM [tokens](https://github.com/immanuel192/semantic-release-sample)
- Export these tokens into your `~/.bash_profile` and source it:
```sh
export GH_TOKEN={your github token}
export NPM_TOKEN={your npm token} # should be optional
```

### Deploy:
- `npm run release`
