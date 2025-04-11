import passport from "passport"

export const sanitizeUser = (user)=>{
    return {id:user.id, role:user.role}
}
 
export const isAuth = (req, res, done) =>{
    return passport.authenticate("jwt")
}