/*
  Warnings:

  - A unique constraint covering the columns `[theme]` on the table `MindMap` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MindMap" ADD COLUMN "theme" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MindMap_theme_key" ON "MindMap"("theme");
