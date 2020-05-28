import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import useMouseScroll from "../../hooks/useMouseScrollVertical";
import TaskList from "../../models/List";
import Coord from "../../models/Coord";
import { saveListRect } from "../../util";
import NewTask from "../newTask";
import TaskCard from "../taskCard";
import {
  CardContent,
  CardHeader,
  Container,
  NewTaskBtn,
  Shadow,
  TaskContainer,
} from "./styled";
import CardlistAction from "./cardlistAction";

interface Props {
  list: TaskList;
  listIndex: number;
  selfTaskDragging: boolean;
  draggingList: boolean;
  draggingSelf: boolean;
  beginDragList: (
    listIndex: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rect: DOMRect
  ) => void;
  moveListHorizontally: (toIndex: number) => void;
}

const CardList = ({
  list,
  listIndex,
  selfTaskDragging,
  beginDragList,
  draggingSelf,
  draggingList,
  moveListHorizontally,
}: Props) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollRef, scrolDown } = useMouseScroll(selfTaskDragging);
  const [addingTask, setAddingTask] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuBtnRef = React.useRef<HTMLDivElement | null>(null);

  const menuPosition: Coord = React.useMemo(() => {
    if (!menuOpen) return { x: 0, y: 0 };
    const rect = (menuBtnRef.current as HTMLDivElement).getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
    };
  }, [menuOpen]);

  React.useLayoutEffect(() => {
    saveListRect(
      listIndex,
      (contentRef.current as HTMLDivElement).getBoundingClientRect()
    );
  }, [listIndex]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (event.button !== 0) return;

    beginDragList(
      listIndex,
      event,
      (contentRef.current as HTMLDivElement).getBoundingClientRect()
    );
  };

  const handleMouseEnter = () => {
    if (!draggingList || draggingSelf) return;
    moveListHorizontally(listIndex);
  };

  return (
    <Container onMouseEnter={handleMouseEnter}>
      <CardContent dragging={draggingSelf} ref={contentRef}>
        <CardHeader
          selfTaskDragging={selfTaskDragging}
          dragging={draggingSelf}
          onMouseDown={handleMouseDown}
        >
          <p>{list.title}</p>
          <div ref={menuBtnRef} onClick={() => setMenuOpen((val) => !val)}>
            <BsThreeDots size={16} />
          </div>
        </CardHeader>
        <TaskContainer dragging={draggingSelf} ref={scrollRef}>
          {list.tasks.map((task, taskIndex) => (
            <TaskCard
              key={task.id}
              task={task}
              listIndex={listIndex}
              index={taskIndex}
            />
          ))}
        </TaskContainer>
        {addingTask ? (
          <NewTask
            listIndex={listIndex}
            closeNewTask={() => setAddingTask(false)}
            scrolDown={scrolDown}
          />
        ) : (
          <NewTaskBtn
            selfTaskDragging={selfTaskDragging}
            dragging={draggingSelf}
            onClick={() => setAddingTask(true)}
          >
            <FiPlus size={16} />
            <p>Adicionar outro cartão</p>
          </NewTaskBtn>
        )}
        <Shadow dragging={draggingSelf} />
      </CardContent>
      {menuOpen && (
        <CardlistAction
          listIndex={listIndex}
          openNewTask={() => setAddingTask(true)}
          close={() => setMenuOpen(false)}
          menuPosition={menuPosition}
        />
      )}
    </Container>
  );
};
export default CardList;
