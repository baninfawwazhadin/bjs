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
import { Role } from './role.entity';

@Index('email_UNIQUE', ['email'], { unique: true })
@Index('phone_number_UNIQUE', ['phone_number'], { unique: true })
@Index('user_id_UNIQUE', ['pkid'], { unique: true })
@Index('id_UNIQUE', ['id'], { unique: true })
@Index('username_UNIQUE', ['username'], { unique: true })
@Index('role_pkid_idx', ['role_pkid'], {})
@Index('user_createdby_pkid_idx', ['created_by'], {})
@Index('user_updatedby_pkid_idx', ['updated_by'], {})
@Index('user_deletedby_pkid_idx', ['deleted_by'], {})
@Entity('user', { schema: 'db_bjs' })
export class User {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('varchar', {
    name: 'username',
    unique: true,
    length: 45,
  })
  username: string;

  @Column('varchar', {
    name: 'password',
    length: 200,
  })
  password: string;

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
    name: 'role_pkid',
    length: 4,
  })
  role_pkid: string;

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

  @Column('int', {
    name: 'password_attempt_counter',
    nullable: true,
  })
  password_attempt_counter: number | null;

  @Column('datetime', {
    name: 'password_expired_date',
    nullable: true,
  })
  password_expired_date: Date | null;

  @Column('datetime', {
    name: 'last_login_date',
    nullable: true,
  })
  last_login_date: Date | null;

  @Column('tinyint', {
    name: 'is_user_locked',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  is_user_locked: boolean | null;

  @Column('tinyint', {
    name: 'is_user_active',
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  is_user_active: boolean | null;

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
    length: 7,
  })
  created_by: string | null;

  @Column('varchar', {
    name: 'updated_by',
    nullable: true,
    length: 7,
  })
  updated_by: string | null;

  @Column('varchar', {
    name: 'deleted_by',
    nullable: true,
    length: 7,
  })
  deleted_by: string | null;

  @ManyToOne(() => Role)
  @JoinColumn([{ name: 'role_pkid', referencedColumnName: 'pkid' }])
  role: Role;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'pkid' }])
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'deleted_by', referencedColumnName: 'pkid' }])
  deletedBy: User;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'updated_by', referencedColumnName: 'pkid' }])
  updatedBy: User;
}
