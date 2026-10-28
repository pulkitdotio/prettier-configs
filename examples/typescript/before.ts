type User={id:string;name:string;active:boolean};
export async function findActiveUsers(repository:{list:()=>Promise<User[]>}):Promise<User[]>{const users=await repository.list();return users.filter(user=>user.active)}
