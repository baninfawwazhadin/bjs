import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { UserOtp } from './user_otp.entity';

@Index('email_UNIQUE', ['email'], { unique: true })
@Index('phone_number_UNIQUE', ['phone_number'], { unique: true })
@Index('user_id_UNIQUE', ['pkid'], { unique: true })
@Index('id_UNIQUE', ['id'], { unique: true })
@Index('username_UNIQUE', ['username'], { unique: true })
@Index('role_id_idx', ['role_pkid'], {})
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

  @Column('int', {
    name: 'role_pkid',
  })
  role_pkid: number;

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

  @Column('varchar', {
    name: 'last_log_message',
    nullable: true,
    length: 500,
  })
  last_log_message: string | null;

  @Column('enum', {
    name: 'status',
    nullable: true,
    enum: ['LOGIN', 'LOGOUT'],
  })
  status: 'LOGIN' | 'LOGOUT' | null;

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

  @ManyToOne(() => Role, (role) => role.user, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'role_pkid', referencedColumnName: 'pkid' }])
  role: Role;

  @OneToMany(() => UserOtp, (user_otp) => user_otp.user)
  userOtp: UserOtp[];
}
