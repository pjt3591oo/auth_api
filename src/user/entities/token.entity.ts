import { IsDateString, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

export class tokenDto {
  @IsNumber()
  id: number;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  accessToken: string;

  @Column('text')
  refreshToken: string;

  @OneToOne(() => User, (user) => user.token)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Token>) {
    Object.assign(this, partial);
  }
}
