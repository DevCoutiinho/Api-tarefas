import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'


const router = express.Router()
const prisma = new PrismaClient()

router.patch('/atualizar_nome', async(req,res)=>{
    const {id} = req.user
    const {name} = req.body

    try{
        const user = await prisma.user.findUnique({
            where:{
                id
            }
        })

        if(!user){
            return res.status(404).json({message:"O usuário não existe"})
        }

        const new_name = await prisma.user.update({
            where:{
                id
            },
            data:{
                name
            }
        })

        return res.status(200).json({message:"O nome do usuário foi atualizado com sucesso"})

    }catch(err){
        return res.status(500).json({message:"O servidor se encontra com problemas. Tente novamente mais tarde."})
    }
})

export default router