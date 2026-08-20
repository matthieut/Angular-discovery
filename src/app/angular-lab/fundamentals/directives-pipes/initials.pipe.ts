import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: true, pure: true })
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }
}
