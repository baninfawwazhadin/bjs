import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Index('email_UNIQUE', ['email'], { unique: true })
@Index('company_id_UNIQUE', ['pkid'], { unique: true })
@Index('pkid_UNIQUE', ['id'], { unique: true })
@Index('phone_number_UNIQUE', ['phone_number'], { unique: true })
@Index('NPWP_UNIQUE', ['NPWP'], { unique: true })
@Entity('company', { schema: 'db_bjs' })
export class Company {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('varchar', {
    name: 'name',
    length: 50,
  })
  name: string;

  @Column('varchar', {
    name: 'phone_number',
    nullable: true,
    unique: true,
    length: 20,
  })
  phone_number: string | null;

  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 50,
  })
  email: string;

  @Column('varchar', {
    name: 'NPWP',
    nullable: true,
    unique: true,
    length: 50,
  })
  NPWP: string | null;

  @Column('tinyint', {
    name: 'is_PPN_included',
    width: 1,
    default: () => "'1'",
  })
  is_PPN_included: boolean;

  @Column('tinyint', {
    name: 'is_active',
    width: 1,
    default: () => "'1'",
  })
  is_active: boolean;

  @CreateDateColumn({
    select: false,
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @UpdateDateColumn({
    select: false,
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @DeleteDateColumn({
    select: false,
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date | null;

  @Column('varchar', {
    select: false,
    name: 'created_by',
    nullable: true,
    length: 45,
  })
  created_by: string | null;

  @Column('varchar', {
    select: false,
    name: 'updated_by',
    nullable: true,
    length: 45,
  })
  updated_by: string | null;

  @Column('varchar', {
    select: false,
    name: 'deleted_by',
    nullable: true,
    length: 45,
  })
  deleted_by: string | null;
}
