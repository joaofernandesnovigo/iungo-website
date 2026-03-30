import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Sidebar } from '../../components/layout/Sidebar';
import { TagManager } from '../../components/tags';
import { CategoryManager, CustomFieldsManager } from '../../components/categories';
import { BackupSection } from './components/BackupSection';

interface NotificationSettings {
  notify_on_assignment: boolean;
  notify_on_client_reply: boolean;
  notify_on_urgent: boolean;
  email_enabled: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'tags' | 'categories' | 'fields' | 'backup'>('notifications');
  const [settings, setSettings] = useState<NotificationSettings>({
    notify_on_assignment: true,
    notify_on_client_reply: true,
    notify_on_urgent: true,
    email_enabled: true,
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          notify_on_assignment: data.notify_on_assignment,
          notify_on_client_reply: data.notify_on_client_reply,
          notify_on_urgent: data.notify_on_urgent,
          email_enabled: data.email_enabled,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setSuccessMessage('');

      const { error } = await supabase
        .from('notification_settings')
        .upsert(
          {
            user_id: user.id,
            ...settings,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        );

      if (error) throw error;

      setSuccessMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-1">Gerencie as preferências do sistema</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'notifications'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-notification-3-line mr-2"></i>
                Notificações
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'tags'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-price-tag-3-line mr-2"></i>
                Tags
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-folder-line mr-2"></i>
                Categorias
              </button>
              <button
                onClick={() => setActiveTab('fields')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'fields'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-list-check-line mr-2"></i>
                Campos Personalizados
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-database-2-line mr-2"></i>
                Backup
              </button>
            </div>

            <div className="p-6">
              {/* Aba de Notificações */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Notificações por E-mail */}
                  <div className="pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Notificações por E-mail
                        </h3>
                        <p className="text-sm text-gray-600">
                          Ativar ou desativar todas as notificações por e-mail
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle('email_enabled')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          settings.email_enabled ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.email_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Tipos de Notificações */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tipos de Notificações</h3>

                    {/* Atribuição de Ticket */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <i className="ri-user-add-line text-xl text-purple-600"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Ticket Atribuído</h4>
                          <p className="text-sm text-gray-600">
                            Receber notificação quando um ticket for atribuído a você
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('notify_on_assignment')}
                        disabled={!settings.email_enabled}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          settings.notify_on_assignment && settings.email_enabled
                            ? 'bg-teal-600'
                            : 'bg-gray-300'
                        } ${!settings.email_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notify_on_assignment && settings.email_enabled
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Resposta do Cliente */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <i className="ri-message-3-line text-xl text-blue-600"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Resposta do Cliente</h4>
                          <p className="text-sm text-gray-600">
                            Receber notificação quando um cliente responder a um ticket
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('notify_on_client_reply')}
                        disabled={!settings.email_enabled}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          settings.notify_on_client_reply && settings.email_enabled
                            ? 'bg-teal-600'
                            : 'bg-gray-300'
                        } ${!settings.email_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notify_on_client_reply && settings.email_enabled
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Tickets Urgentes */}
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <i className="ri-alarm-warning-line text-xl text-red-600"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Tickets Urgentes</h4>
                          <p className="text-sm text-gray-600">
                            Receber alertas sobre tickets urgentes não atendidos
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('notify_on_urgent')}
                        disabled={!settings.email_enabled}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          settings.notify_on_urgent && settings.email_enabled
                            ? 'bg-teal-600'
                            : 'bg-gray-300'
                        } ${!settings.email_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notify_on_urgent && settings.email_enabled
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Botão Salvar */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      {successMessage && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <i className="ri-checkbox-circle-line text-xl"></i>
                          <span className="text-sm font-medium">{successMessage}</span>
                        </div>
                      )}
                      <div className="ml-auto">
                        <Button onClick={handleSave} disabled={saving} className="whitespace-nowrap">
                          {saving ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <i className="ri-save-line mr-2"></i>
                              Salvar Configurações
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba de Tags */}
              {activeTab === 'tags' && <TagManager />}

              {/* Aba de Categorias */}
              {activeTab === 'categories' && <CategoryManager />}

              {/* Aba de Campos Personalizados */}
              {activeTab === 'fields' && <CustomFieldsManager />}

              {/* Aba de Backup */}
              {activeTab === 'backup' && <BackupSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
