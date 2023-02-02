import { Injectable } from '@nestjs/common';
import { Task, TaskPriority, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    //Try to get task

    //If not found throw error

    //Otherwise, return the found task

    const foundTask = this.tasks.find((task) => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return foundTask;
  }

  getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    //define a temp array to hold the task arrays
    let tasks = this.getAllTasks();

    //if status is defined
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
        ) {
          return true;
        }

        return false;
      });
    }

    return tasks;
  }

  deleteTask(id: string): Task {
    const taskWithIdIndex = this.tasks.findIndex((obj) => obj.id === id);
    const deletedObject = this.tasks[taskWithIdIndex];
    if (taskWithIdIndex <= -1){
      throw new NotFoundException(`Task with ${id} not found`);
    }
    this.tasks.splice(taskWithIdIndex, 1);

    return deletedObject;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description, priority } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
      priority,
    };

    this.tasks.push(task);

    return task;
  }
}
