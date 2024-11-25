import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Index('id_UNIQUE', ['pkid'], { unique: true })
@Index('user_otp_pkid_idx', ['user_pkid'], {})
@Entity('user_otp', { schema: 'db_bjs' })
export class UserOtp {
  @PrimaryGeneratedColumn({ type: 'int' })
  pkid: number;

  @Column('varchar', {
    name: 'user_pkid',
    length: 7,
  })
  user_pkid: string;

  @Column('varchar', {
    name: 'otp_code',
    nullable: true,
    length: 6,
  })
  otp_code: string | null;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @Column('datetime', {
    name: 'expired_at',
    nullable: true,
  })
  expired_at: Date | null;

  @Column('tinyint', {
    name: 'is_used',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  is_used: boolean | null;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'user_pkid', referencedColumnName: 'pkid' }])
  user: User;
}
