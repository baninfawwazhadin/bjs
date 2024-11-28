import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('id', ['id'], { unique: true })
@Index('email', ['email'], { unique: true })
@Entity('user_dummy', { schema: 'db_bjs' })
export class UserDummy {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 255,
  })
  email: string;

  @Column('varchar', {
    name: 'password',
    length: 255,
  })
  password: string;

  @Column('varchar', {
    name: 'name',
    length: 255,
  })
  name: string;

  @CreateDateColumn({
    select: false,
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    select: false,
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
