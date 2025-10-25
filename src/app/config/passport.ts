import passport from "passport"
import bcryptjs from 'bcryptjs';
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";


passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email })

            if (!isUserExist) {
                return done(null, false, { message: "User Dose Not Exist" })
            }     
            
            if (isUserExist.isActive === IsActive.INACTIVE) {
                return done(`user is ${isUserExist.isActive}`)
            }

            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password Dose Not Exist" })
            }

            return done(null, isUserExist)

        } catch (error) {
            done(error)
        }
    })
)