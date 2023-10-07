export interface SuperUser {
    username: string;
    email: string;
}

export interface ModifySuperUser extends SuperUser {
    password: string;
    passwordConfirm: string;
    photo: string;
}

export interface CreateSuperUser extends SuperUser {
    password: string;
    passwordConfirm: string;
    permissions: Permissions;
}

export interface ExistSuperUser extends SuperUser {
    id: string;
    photo: string;
    role: string;
    created_at: Date;
    updated_at: Date;
    permissions: Permissions;
}

export interface Permissions {
    users_ban: boolean;
    orgs_ban: boolean;
    page_add: boolean;
    pages_edit: boolean;
    pages_delete: boolean;
    blog_add: boolean;
    blog_edit: boolean;
    blog_delete: boolean;
    usercomments_edit: boolean;
    usercomments_delete: boolean;
}
