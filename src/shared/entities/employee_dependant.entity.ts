import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { Employee } from './employee.entity';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('pkid_UNIQUE', ['pkid'], { unique: true })
@Index('employeedependant_employee_pkid_idx', ['employee_pkid'], {})
@Index('employeedependant_company_idx', ['company_pkid'], {})
@Entity('employee_dependant', { schema: 'db_bjs' })
export class EmployeeDependant {
  @Column('int', { name: 'id', unique: true })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('varchar', { name: 'first_name', length: 20 })
  first_name: string;

  @Column('varchar', { name: 'last_name', length: 20 })
  last_name: string;

  @Column('varchar', { name: 'phone_number', length: 20 })
  phone_number: string;

  @Column('varchar', { name: 'email', length: 50 })
  email: string;

  @Column('varchar', { name: 'employee_pkid', length: 10 })
  employee_pkid: string;

  @Column('varchar', { name: 'company_pkid', length: 7 })
  company_pkid: string;

  @Column('tinyint', { name: 'is_active', width: 1, default: () => "'1'" })
  is_active: boolean;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @Column('varchar', { name: 'created_by', nullable: true, length: 45 })
  created_by: string | null;

  @Column('varchar', { name: 'updated_by', nullable: true, length: 45 })
  updated_by: string | null;

  @Column('varchar', { name: 'deleted_by', nullable: true, length: 45 })
  deleted_by: string | null;

  @ManyToOne(() => Company, (company) => company.employeeDependant, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'company_pkid', referencedColumnName: 'pkid' }])
  company: Company;

  @ManyToOne(() => Employee, (employee) => employee.employeeDependant, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'employee_pkid', referencedColumnName: 'pkid' }])
  employee: Employee;
}
