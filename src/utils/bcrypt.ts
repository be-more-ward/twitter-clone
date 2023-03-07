import bcryptjs from "bcryptjs"

export const hashPassword = async (password:string)=>{
    const salt = await bcryptjs.genSalt(10)
    return await bcryptjs.hash(password, salt)
}

export const comparePasswords = async (candidatePassword: string, hashedPassword:string)=>{
    const isMatch = await bcryptjs.compare(candidatePassword, hashedPassword)
    return isMatch
}