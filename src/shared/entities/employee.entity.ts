import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('pkid_UNIQUE', ['pkid'], { unique: true })
@Index('phone_numer_UNIQUE', ['phone_number'], { unique: true })
@Index('email_UNIQUE', ['email'], { unique: true })
@Index('employee_company_pkid_idx', ['company_pkid'], {})
@Entity('employee', { schema: 'db_bjs' })
export class Employee {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('enum', {
    name: 'person_type',
    enum: ['TKA', 'Dependant', 'Tamu', 'Lainnya'],
  })
  person_type: 'TKA' | 'Dependant' | 'Tamu' | 'Lainnya';

  @Column('varchar', {
    name: 'first_name',
    length: 20,
  })
  first_name: string;

  @Column('varchar', {
    name: 'last_name',
    length: 20,
  })
  last_name: string;

  @Column('varchar', {
    name: 'phone_number',
    unique: true,
    length: 20,
  })
  phone_number: string;

  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 50,
  })
  email: string;

  @Column('varchar', {
    name: 'company_pkid',
    length: 7,
  })
  company_pkid: string;

  @Column('tinyint', {
    name: 'is_active',
    width: 1,
    default: () => "'1'",
  })
  is_active: boolean;

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

  @ManyToOne(() => Company)
  @JoinColumn([{ name: 'company_pkid', referencedColumnName: 'pkid' }])
  company: Company;
}
