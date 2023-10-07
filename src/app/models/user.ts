export interface User {
    username:   string;
    photo:      string;
    name:       string;
    surname:    string;
    address:    string;
    ban:        boolean;
    comments:   any[];
    favs:       any[];
    email:      string;
    tel:        string;
    created_at: Date;
    updated_at: Date;
}
