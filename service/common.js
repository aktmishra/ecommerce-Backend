export const sanitizeUser = (user)=>{
    return {id:user.id, role:user.role}
}
 
export const isAuth = (req, res, done) =>{
    if (req.user) {
        done()
    } else {
        res.status(401).json({message:"You are Unauthorized", success:false})
    }
}