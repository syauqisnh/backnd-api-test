import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt' 

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10) 

  const admin = await prisma.user.upsert({
    where: { email: 'super@gmail.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'super@gmail.com',
      password: hashedPassword, 
      role: 'INSTRUCTOR',
    },
  })

  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
