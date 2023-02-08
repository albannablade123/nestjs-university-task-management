import { TaskPriority } from '../task.model';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
