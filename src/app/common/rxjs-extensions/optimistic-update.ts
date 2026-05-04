import { catchError, Observable, of, switchMap } from 'rxjs';

export const optimisticUpdate = <T>({
  run,
  onError,
}: {
  run: (action: T) => Observable<any>;
  onError?: (error: any, action: T) => any;
}) => {
  return (source$: Observable<T>) =>
    source$.pipe(
      switchMap((action) =>
        run(action).pipe(
          catchError((error) => {
            console.log('Optimistic update failed', error);

            if (onError) {
              return of(onError(error, action));
            }

            return of(action);
          }),
        ),
      ),
    );
};
