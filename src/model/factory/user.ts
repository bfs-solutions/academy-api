
import * as crypto from "crypto";

import * as sequelize from "sequelize";

/** User */
interface User {
    /** Unique identifier */
    login?: string;
    password?: string;
    salt?: string;

    /** List of user roles */
    roles?: Array<string>;

    /** Whether the user account is disabled or not.
     *
     * It affect the behaviour of the authenticate() instance method.
     */
    disabled?: boolean;
    name?: string;
}

/** User instance */
interface UserInstance extends sequelize.Instance<User>, User {}

interface UserModel extends sequelize.Model<UserInstance, User> {}

const UserSchema: sequelize.DefineAttributes = {
    login: {
        type: sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: sequelize.TEXT,
    salt: sequelize.TEXT,
    roles: sequelize.ARRAY(sequelize.STRING),
    disabled: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    name: {
        type: sequelize.STRING
    },
};

function applyCrypto(settings: any, instance: UserInstance, options, done) {

    console.log(arguments);

    // end early if password hasn't been changed
    if (!instance.changed("password")) return done();

    crypto.randomBytes(settings.saltlen || 32, (err, buf) => {

        // end early if an error has occurred
        if (err) { return done(err); }

        let salt = buf.toString("hex");

        crypto.pbkdf2(instance.get("password"), salt, settings.iterations || 12000, settings.keylen || 512, "sha512", (err, hashRaw) => {

            // end early if an error has occurred
            if (err) { return done(err); }

            instance.set("password", hashRaw.toString("hex"));
            instance.set("salt", salt);

            done();
        });
    });
}

export default function(sequelize: sequelize.Sequelize, options: any): UserModel {
    let Model = <UserModel>sequelize.define<UserInstance, User>(options.name || "user", UserSchema, {
        instanceMethods: {
            /** toJSON override.
             *
             * Override is needed to hide sensitive data from Web clients.
             */
            toJSON: function () {
                let values = Object.assign({}, this.get());

                delete values.password;
                delete values.salt;
                return values;
            },

            authenticate: function (password, done) {
                let self = this;

                // prevent authenticating disabled accounts
                if (this.get("disabled")) {
                    return done(null, false, {
                        message: options.disabledAccountError || "Authentication not possible. Account is disabled!"
                    });
                }

                // prevent to throw error from crypto.pbkdf2
                if (!this.get("salt")) {
                    return done(null, false, {
                        message: options.noSaltValueStoredError || "Authentication not possible. No salt value stored in db!"
                    });
                }

                crypto.pbkdf2(password, this.get("salt"), options.iterations || 12000, options.keylen || 512, "sha512", function (err, hashRaw) {
                    // end early if an error has occurred
                    if (err) { return done(err); }

                    if (hashRaw.toString("hex") === self.get("password")) {
                        return done(null, self);
                    } else {
                        return done(null, false, {
                            message: options.incorrectPasswordError || "Incorrect password"
                        });
                    }
                });
            }
        },
        getterMethods: {
            id: function()  { return this.login; }
        }
    });

    (<any>Model).authenticate = function () {
        let self = this;
        return function (username, password, cb) {
            self.findById(username).then(user => {
                if (user) {
                    return user.authenticate(password, cb);
                } else {
                    return cb(null, false, {
                        message: options.incorrectUsernameError || "Incorrect username"
                    });
                }
            }, err => cb(err));
        };
    };

    // set crypto hooks
    Model.beforeCreate(applyCrypto.bind(null, options));
    Model.beforeUpdate(applyCrypto.bind(null, options));

    (<any>Model).setRelations = function (models) {
        Model.hasMany(models.teaching, {as: "teachings", foreignKey: "user"});
    };

    return Model;
}