-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "durationDays" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchasedPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "externalId" TEXT,
    "status" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchasedPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "purchasedPlanId" INTEGER,
    "externalId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_externalId_key" ON "Plan"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedPlan_externalId_key" ON "PurchasedPlan"("externalId");

-- CreateIndex
CREATE INDEX "PurchasedPlan_userId_idx" ON "PurchasedPlan"("userId");

-- CreateIndex
CREATE INDEX "PurchasedPlan_planId_idx" ON "PurchasedPlan"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentHistory_externalId_key" ON "PaymentHistory"("externalId");

-- CreateIndex
CREATE INDEX "PaymentHistory_userId_idx" ON "PaymentHistory"("userId");

-- CreateIndex
CREATE INDEX "PaymentHistory_purchasedPlanId_idx" ON "PaymentHistory"("purchasedPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_externalId_key" ON "Notification"("externalId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- AddForeignKey
ALTER TABLE "PurchasedPlan" ADD CONSTRAINT "PurchasedPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedPlan" ADD CONSTRAINT "PurchasedPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_purchasedPlanId_fkey" FOREIGN KEY ("purchasedPlanId") REFERENCES "PurchasedPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- SeedData
INSERT INTO "User" ("email", "passwordHash", "name", "createdAt", "updatedAt")
VALUES ('demo@freecity.local', 'seeded-password-hash', 'Demo User', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Plan" ("externalId", "name", "priceCents", "currency", "durationDays", "description", "isActive", "createdAt", "updatedAt")
VALUES
  ('plan-1m', 'Freecity 1 месяц', 29900, 'RUB', 30, 'Идеально для знакомства с сервисом.', true, NOW(), NOW()),
  ('plan-12m', 'Freecity 12 месяцев', 298800, 'RUB', 365, 'Лучший выбор для постоянной защиты.', true, NOW(), NOW()),
  ('plan-team', 'Freecity Team', 99000, 'RUB', 30, 'До 10 устройств и приоритетная поддержка.', true, NOW(), NOW())
ON CONFLICT ("externalId") DO NOTHING;

INSERT INTO "PurchasedPlan" (
  "userId", "planId", "externalId", "status", "startsAt", "expiresAt", "autoRenew", "createdAt", "updatedAt"
)
SELECT
  u."id",
  p."id",
  'pp-seed-1',
  'ACTIVE',
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '355 days',
  false,
  NOW(),
  NOW()
FROM "User" u
JOIN "Plan" p ON p."externalId" = 'plan-12m'
WHERE u."email" = 'demo@freecity.local'
ON CONFLICT ("externalId") DO NOTHING;

INSERT INTO "PaymentHistory" (
  "userId", "purchasedPlanId", "externalId", "amountCents", "currency", "status", "paymentMethod", "paidAt", "createdAt", "updatedAt"
)
SELECT
  u."id",
  pp."id",
  'pay-seed-1',
  298800,
  'RUB',
  'PAID',
  'Банковская карта',
  NOW() - INTERVAL '10 days',
  NOW(),
  NOW()
FROM "User" u
JOIN "PurchasedPlan" pp ON pp."externalId" = 'pp-seed-1'
WHERE u."email" = 'demo@freecity.local'
ON CONFLICT ("externalId") DO NOTHING;

INSERT INTO "Notification" (
  "userId", "externalId", "title", "message", "type", "isRead", "createdAt", "updatedAt"
)
SELECT
  u."id",
  'notif-seed-1',
  'Продление подписки',
  'Ваш тариф Freecity 12 месяцев успешно активирован.',
  'info',
  false,
  NOW(),
  NOW()
FROM "User" u
WHERE u."email" = 'demo@freecity.local'
ON CONFLICT ("externalId") DO NOTHING;
