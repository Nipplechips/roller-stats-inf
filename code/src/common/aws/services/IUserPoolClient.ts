interface IUserPoolClient{
    getUserByUsername(username: String): any;
}

export {IUserPoolClient}