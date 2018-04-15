class Users{
    constructor(){
        this.users = [];
    }
    addUser(id,name,room) {
        var user = {id,name,room};
        this.users.push(user);
        return user;
    }
    fetchUser(id){
         return this.users.filter((user)=> user.id === id)[0];
    }
    removeUser(id){
        var user = this.fetchUser(id);
        if(user){
            this.users = this.users.filter((user)=> user.id !== id);
        }
        return user; 
    }
    getUserList(room){
        var userList = this.users.filter((user)=> user.room === room);
        var usersNameArray = userList.map((user)=>user.name);
        return usersNameArray;
    }
}
module.exports = {Users};