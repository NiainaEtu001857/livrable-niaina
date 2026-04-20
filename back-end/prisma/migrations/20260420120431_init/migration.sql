-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardState" (
    "id" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WizardState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Defunt" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "dod" TIMESTAMP(3) NOT NULL,
    "commune" TEXT NOT NULL,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Defunt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Heir" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "lien" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Heir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Declarant" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "qualite" TEXT NOT NULL,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Declarant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certs" (
    "id" TEXT NOT NULL,
    "exact" BOOLEAN NOT NULL,
    "cgu" BOOLEAN NOT NULL,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Certs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WizardState_userId_key" ON "WizardState"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Defunt_wizardId_key" ON "Defunt"("wizardId");

-- CreateIndex
CREATE UNIQUE INDEX "Declarant_wizardId_key" ON "Declarant"("wizardId");

-- CreateIndex
CREATE UNIQUE INDEX "Certs_wizardId_key" ON "Certs"("wizardId");

-- AddForeignKey
ALTER TABLE "WizardState" ADD CONSTRAINT "WizardState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defunt" ADD CONSTRAINT "Defunt_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "WizardState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Heir" ADD CONSTRAINT "Heir_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "WizardState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "WizardState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Declarant" ADD CONSTRAINT "Declarant_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "WizardState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certs" ADD CONSTRAINT "Certs_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "WizardState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
