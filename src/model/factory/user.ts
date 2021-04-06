
import * as crypto from "crypto";

import { ARRAY, BOOLEAN, Model, Sequelize, STRING, TEXT } from "sequelize";

/** User */
interface UserAttributes {
    /** Unique identifier */
    login: string;
    password: string;
    salt: string;

    /** List of user roles */
    roles: Array<string>;

    /** Whether the user account is disabled or not.
     *
     * It affect the behaviour of the authenticate() instance method.
     */
    disabled: boolean;
    name: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
    /** Unique identifier */
    login!: string;
    password!: string;
    salt!: string;

    /** List of user roles */
    roles!: Array<string>;

    /** Whether the user account is disabled or not.
     *
     * It affect the behaviour of the authenticate() instance method.
     */
    disabled!: boolean;
    name!: string;

    get id()  { return this.login; }

    /** toJSON override.
     *
     * Override is needed to hide sensitive data from Web clients.
     */
    toJSON() {
        const values = Object.assign({}, this.get());

        delete values.password;
        delete values.salt;
        return values;
    }

    authenticate(password, done) {
        const self = this;

        // prevent authenticating disabled accounts
        if (this.get("disabled")) {
            return done(null, false, {
                message: "Authentication not possible. Account is disabled!"
            });
        }

        // prevent to throw error from crypto.pbkdf2
        if (!this.get("salt")) {
            return done(null, false, {
                message: "Authentication not possible. No salt value stored in db!"
            });
        }

        crypto.pbkdf2(password, this.get("salt"), 12000, 512, "sha512", function (err, hashRaw) {
            // end early if an error has occurred
            if (err) { return done(err); }

            if (hashRaw.toString("hex") === self.get("password")) {
                return done(null, self);
            } else {
                return done(null, false, {
                    message: "Incorrect password"
                });
            }
        });
    }

    static authenticate() {
        const self = this;
        return function (username, password, cb) {
            self.findByPk(username).then(user => {
                if (user) {
                    return user.authenticate(password, cb);
                } else {
                    return cb(null, false, {
                        message: "Incorrect username"
                    });
                }
            }, err => cb(err));
        };
    }

    static setRelations(models) {
        User.hasMany(models.Teaching, {as: "teachings", foreignKey: "user"});
    }
}

function applyCrypto(settings: any, instance: User, options) {

    // end early if password hasn't been changed
    if (!instance.changed("password")) return;

    return new Promise((resolve, reject) => {
        crypto.randomBytes(settings.saltlen || 32, (err, buf) => {

            // end early if an error has occurred
            if (err) { return reject(err); }
    
            const salt = buf.toString("hex");
    
            crypto.pbkdf2(instance.get("password"), salt, settings.iterations || 12000, settings.keylen || 512, "sha512", (err, hashRaw) => {
    
                // end early if an error has occurred
                if (err) { return reject(err); }
    
                instance.set("password", hashRaw.toString("hex"));
                instance.set("salt", salt);
    
                resolve(undefined);
            });
        });
    });
}

export default function(sequelize: Sequelize, options: any): typeof User {
    User.init({
        login: {
            type: STRING,
            primaryKey: true,
            allowNull: false
        },
        password: TEXT,
        salt: TEXT,
        roles: ARRAY(STRING),
        disabled: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        name: {
            type: STRING
        },
    }, { sequelize, tableName: 'users' });

    // set crypto hooks
    User.beforeCreate(applyCrypto.bind(null, options));
    User.beforeUpdate(applyCrypto.bind(null, options));

    return User;
}