import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { Logger } from '@nestjs/common/services';
import { InternalServerErrorException } from '@nestjs/common/exceptions';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();

      if (tasks.length === 0) {
        throw new NotFoundException(`not found`);
      }

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch task for user "${
          user.username
        }" Filters :${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
     
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, priority } = createTaskDto;

    const task = this.create({
      title,
      description,
      priority,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }
}
