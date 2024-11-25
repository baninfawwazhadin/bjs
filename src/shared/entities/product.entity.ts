import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Index('product_id_UNIQUE', ['pkid'], { unique: true })
@Index('pkid_UNIQUE', ['id'], { unique: true })
@Index('product_name_UNIQUE', ['name'], { unique: true })
@Entity('product', { schema: 'db_bjs' })
export class Product {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('varchar', {
    name: 'name',
    unique: true,
    length: 50,
  })
  name: string;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date | null;

  @Column('varchar', {
    name: 'created_by',
    nullable: true,
    length: 45,
  })
  created_by: string | null;

  @Column('varchar', {
    name: 'updated_by',
    nullable: true,
    length: 45,
  })
  updated_by: string | null;

  @Column('varchar', {
    name: 'deleted_by',
    nullable: true,
    length: 45,
  })
  deleted_by: string | null;
}
