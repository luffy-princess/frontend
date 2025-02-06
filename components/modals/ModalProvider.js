import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createContext, useContext, useRef, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AlertModal from './AlertModal';
import InfoModal from './InfoModal';

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
        isOpen: false
    });

    function modalOpen(data) {
        const { modalType, title, description, action } = data;

        setModalState({
            modalType,
            title,
            description,
            action,
            isOpen: true
        });
    }

    function modalClose() {
        setModalState({
            modalType: '',
            title: '',
            description: '',
            action: () => { },
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