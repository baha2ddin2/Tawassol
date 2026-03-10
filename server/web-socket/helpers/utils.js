export function createPrivateRoom(user1,user2){
    return `private_${[user1, user2].sort().join("_")}`
}