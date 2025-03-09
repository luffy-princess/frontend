import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createContext, useContext, useRef, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AlertModal from './AlertModal';
import InfoModal from './InfoModal';
import TrainingResultModal from './TrainingResultModal';

const ModalContext = createContext();

export function useModalDispatch() {
    return useContext(ModalContext);
}

export function ModalProvider({ children }) {
    const [modalState, setModalState] = useState({
        modalType: '',
        title: '',
        description: '',
        action: () => { },
        score: 0,
        improvements: [],
        isOpen: false
    });

    function modalOpen(data) {
        const { modalType, title, description, action, score, improvements } = data;

        setModalState({
            modalType,
            title,
            description,
            action,
            score,
            improvements,
            isOpen: true
        });
    }

    function modalClose() {
        setModalState({
            modalType: '',
            title: '',
            description: '',
            action: () => { },
            score: 0,
            improvements: [],
            isOpen: false
        });
    }

    function renderModal() {
        if (modalState.isOpen) {
            if (modalState.modalType === 'info') {
                return (
                    <InfoModal
                        title={modalState.title}
                        description={modalState.description}
                        action={modalState.action}
                        visible={modalState.isOpen}
                        onClose={modalClose}
                    />
                );
            } else if (modalState.modalType === 'alert') {
                return (
                    <AlertModal
                        title={modalState.title}
                        description={modalState.description}
                        action={modalState.action}
                        visible={modalState.isOpen}
                        onClose={modalClose}
                    />
                );
            } else if (modalState.modalType === 'training_result') {
                return (
                    <TrainingResultModal
                        title={modalState.title}
                        score={modalState.score}
                        description={modalState.description}
                        improvements={modalState.improvements}
                        visible={modalState.isOpen}
                        onClose={modalClose}
                    />
                );
            }
        }
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <ModalContext.Provider
                    value={{
                        modalOpen,
                        modalClose
                    }}
                >
                    {renderModal()}
                    {children}
                </ModalContext.Provider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
