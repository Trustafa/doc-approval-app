import { prisma } from './app/api/prisma';

async function main() {
  //
  // ---- USERS ----
  //
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      hashedPassword: 'hashed_pw_1',
      disabled: false,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Miller',
      email: 'bob@example.com',
      hashedPassword: 'hashed_pw_2',
      disabled: false,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie Singh',
      email: 'charlie@example.com',
      hashedPassword: 'hashed_pw_3',
      disabled: false,
    },
  });

  //
  // ---- FILES ----
  //
  const aliceSignature = await prisma.file.create({
    data: {
      createdById: alice.id,
      key: 'signatures/alice.png',
      filename: 'alice_signature.png',
      sizeInBytes: 20480,
    },
  });

  const approvalFile = await prisma.file.create({
    data: {
      createdById: bob.id,
      key: 'requests/req1_approval.pdf',
      filename: 'approval_form.pdf',
      sizeInBytes: 502000,
    },
  });

  const signedApprovalFile = await prisma.file.create({
    data: {
      createdById: alice.id,
      key: 'requests/req1_signed.png',
      filename: 'signed_request.png',
      sizeInBytes: 100234,
    },
  });

  const supportingFile = await prisma.file.create({
    data: {
      createdById: bob.id,
      key: 'supporting/receipt.png',
      filename: 'receipt.png',
      sizeInBytes: 90000,
    },
  });

  //
  // ---- UPDATE ALICE SIGNATURE ----
  //
  await prisma.user.update({
    where: { id: alice.id },
    data: { signatureFileId: aliceSignature.id },
  });

  //
  // ---- REQUEST ----
  //
  const request = await prisma.request.create({
    data: {
      payee: 'Tech Supplies Ltd',
      amount: '150.00',
      currency: 'GBP',
      approvalFileDate: new Date('2024-01-20T09:00:00Z'),
      title: 'Computer Accessories',
      requesterId: alice.id,
      approvalFileId: approvalFile.id,
      signedApprovalFileId: signedApprovalFile.id,

      // relation for supporting files
      supportingFiles: {
        connect: [{ id: supportingFile.id }],
      },
    },
  });

  //
  // ---- APPROVALS ----
  //
  await prisma.approval.create({
    data: {
      approverId: bob.id,
      requestId: request.id,
      decision: 'APPROVED',
      decisionAt: new Date('2024-01-20T11:10:00Z'),
    },
  });

  await prisma.approval.create({
    data: {
      approverId: charlie.id,
      requestId: request.id,
      // decision defaults to PENDING
    },
  });

  //
  // ---- USER SESSIONS ----
  //
  await prisma.userSession.create({
    data: {
      userId: alice.id,
    },
  });

  await prisma.userSession.create({
    data: {
      userId: bob.id,
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
