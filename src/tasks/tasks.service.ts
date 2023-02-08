import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';
import { TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async getTaskById(id: string): Promise<Task> {
    const found: Task = await this.taskRepository.findOneBy({ id: id });

    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string) {
    try {
      await this.taskRepository.delete({ id: id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  // getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   //define a temp array to hold the task arrays
  //   let tasks = this.getAllTasks();

  //   //if status is defined
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (
  //         task.title.toLowerCase().includes(search) ||
  //         task.description.toLowerCase().includes(search)
  //       ) {
  //         return true;
  //       }

  //       return false;
  //     });
  //   }

  //   return tasks;
  // }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    console.log('reached here');
    console.log(status);
    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
