import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_log_auth', { schema: 'db_bjs' })
export class UserLogAuth {
  @PrimaryGeneratedColumn({ type: 'int' })
  pkid: number;

  @Column('varchar', {
    name: 'name',
    length: 45,
  })
  name: string;

  @Column('varchar', {
    name: 'username',
    length: 45,
  })
  username: string;

  @Column('enum', {
    name: 'role',
    enum: ['super admin', 'admin order', 'general manager'],
  })
  role: 'super admin' | 'admin order' | 'general manager';

  @Column('date', {
    name: 'date',
  })
  date: string;

  @Column('datetime', {
    name: 'login_time',
    nullable: true,
  })
  login_time: Date | null;

  @Column('datetime', {
    name: 'logout_time',
    nullable: true,
  })
  logout_time: Date | null;

  @Column('varchar', {
    name: 'login_status',
    nullable: true,
    length: 45,
  })
  login_status: string | null;
}
