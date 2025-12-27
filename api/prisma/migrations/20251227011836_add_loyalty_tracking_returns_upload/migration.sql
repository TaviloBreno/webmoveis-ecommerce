-- AlterTable
ALTER TABLE "order" ADD COLUMN     "loyalty_points_earned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "loyalty_points_used" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tracking_code" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "loyalty_points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "loyalty_tier" TEXT NOT NULL DEFAULT 'bronze';

-- CreateTable
CREATE TABLE "loyalty_transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reference_type" TEXT,
    "reference_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_tracking_event" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_tracking_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "refund_amount" DOUBLE PRECISION,
    "exchange_product_id" INTEGER,
    "admin_notes" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_item" (
    "id" SERIAL NOT NULL,
    "return_id" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "condition" TEXT,

    CONSTRAINT "return_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "loyalty_transaction" ADD CONSTRAINT "loyalty_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_tracking_event" ADD CONSTRAINT "order_tracking_event_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return" ADD CONSTRAINT "return_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return" ADD CONSTRAINT "return_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_item" ADD CONSTRAINT "return_item_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "return"("id") ON DELETE CASCADE ON UPDATE CASCADE;
