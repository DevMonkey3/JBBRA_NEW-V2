import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@jbbc.jp'
  const pass  = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const passwordHash = await bcrypt.hash(pass, 12)

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Jbbra Admin', passwordHash },
  })

  console.log(`Seeded admin:\n  Email: ${email}\n  Pass : ${pass}`)
}

main().finally(() => prisma.$disconnect())
