from django.urls import path
from base.views import orderViews as views


urlpatterns = [
    path('', views.getOrder, name='order'),
    path('add/', views.orderItem, name='add-order'),
    path('userorder/', views.getUserOrder, name='user-order'),

    path('<str:pk>/deliver', views.updateDelivered, name='order-delivered'),

    path('<str:pk>/', views.getOrderId, name='user-order'),
    path('<str:pk>/pay', views.updatePayment, name='payment'),

]