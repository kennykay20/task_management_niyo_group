import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTaskTable1715978522717 implements MigrationInterface {
  name = 'AlterTaskTable1715978522717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" RENAME COLUMN "statuses" TO "status"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" RENAME COLUMN "status" TO "statuses"`,
    );
  }
}
